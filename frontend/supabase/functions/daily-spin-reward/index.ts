import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with SERVICE_ROLE_KEY to bypass RLS
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

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    const { wonTicket } = await req.json();

    console.log(`Processing daily spin reward for user ${user.id}, won: ${wonTicket}`);

    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("wallet_balance")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      throw profileError;
    }

    let updatedBalance = profile.wallet_balance;

    // If won ticket, update wallet balance and create transaction
    if (wonTicket) {
      updatedBalance = profile.wallet_balance + 1;

      // Update wallet balance (using SERVICE_ROLE_KEY, bypasses RLS)
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ wallet_balance: updatedBalance })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating wallet balance:", updateError);
        throw updateError;
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from("wallet_transactions")
        .insert({
          user_id: user.id,
          type: "win",
          amount: 1,
          description: "Daily Lucky Wheel - Free Ticket",
        });

      if (transactionError) {
        console.error("Error creating transaction:", transactionError);
        throw transactionError;
      }

      console.log(`Successfully awarded 1 ticket to user ${user.id}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        wonTicket,
        newBalance: updatedBalance,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    console.error("Error processing daily spin reward:", errorMessage);

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
