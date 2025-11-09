import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");

  if (!signature) {
    console.error("No Stripe signature found");
    return new Response("No signature", { status: 400 });
  }

  const body = await req.text();
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", errorMessage);
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  console.log("Webhook event received:", event.type, "ID:", event.id);

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log("Processing completed checkout session:", session.id);

    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

      const userId = session.metadata?.user_id;
      const packageName = session.metadata?.package_name || "Ticket Package";

      if (!userId) {
        console.error("No user_id in session metadata");
        return new Response("No user ID found", { status: 400 });
      }

      // Get the line items to determine ticket amount
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;

      // Map price IDs to ticket amounts
      const ticketAmounts: Record<string, { tickets: number; description: string }> = {
        "price_1SRf5yK2pvACY45Z8luE9obN": { tickets: 10, description: "10 tickets" },
        "price_1SRf5zK2pvACY45Zr8uSEFM4": { tickets: 50, description: "50 tickets" },
        "price_1SRf60K2pvACY45Zgg0gMw6Y": { tickets: 100, description: "100 tickets" },
        "price_1SRf60K2pvACY45ZKJUo0Nzx": { tickets: 500, description: "500 tickets" },
      };

      const ticketInfo = ticketAmounts[priceId || ""];
      
      if (!ticketInfo) {
        console.error("Unknown price ID:", priceId);
        return new Response("Unknown price", { status: 400 });
      }

      console.log(`Adding ${ticketInfo.tickets} tickets to user ${userId}`);

      // Get payment intent to retrieve receipt URL
      const paymentIntentId = session.payment_intent as string;
      let receiptUrl = null;
      
      if (paymentIntentId) {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const chargeId = typeof paymentIntent.latest_charge === 'string' 
          ? paymentIntent.latest_charge 
          : paymentIntent.latest_charge?.id;
          
        if (chargeId) {
          const charge = await stripe.charges.retrieve(chargeId);
          receiptUrl = charge.receipt_url;
          console.log("Receipt URL retrieved:", receiptUrl);
        }
      }

      // Get current balance
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      // Update wallet balance
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ wallet_balance: profile.wallet_balance + ticketInfo.tickets })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating wallet:", updateError);
        throw updateError;
      }

      // Create transaction record with Stripe details
      const { error: transactionError } = await supabase
        .from("wallet_transactions")
        .insert({
          user_id: userId,
          type: "purchase",
          amount: ticketInfo.tickets,
          description: `Purchased ${ticketInfo.description} for $${(session.amount_total || 0) / 100}`,
          stripe_payment_id: paymentIntentId,
          stripe_session_id: session.id,
          receipt_url: receiptUrl,
        });

      if (transactionError) {
        console.error("Error creating transaction:", transactionError);
        throw transactionError;
      }

      console.log("Successfully processed payment for user:", userId);

      return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Error processing webhook:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      return new Response(
        JSON.stringify({ error: errorMessage }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  }

  // Return a response to acknowledge receipt of the event
  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
