import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Starting scheduled draw check...");

    // Find products that are ready for draw (draw_date has passed and no winner yet)
    const { data: productsToRun, error: fetchError } = await supabaseClient
      .from("products")
      .select("id, name, draw_date, tickets_required, tickets_sold")
      .is("winner_id", null)
      .not("draw_date", "is", null)
      .lte("draw_date", new Date().toISOString());

    if (fetchError) {
      console.error("Error fetching products:", fetchError);
      throw fetchError;
    }

    if (!productsToRun || productsToRun.length === 0) {
      console.log("No products ready for draw");
      return new Response(
        JSON.stringify({ message: "No products ready for draw", count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    console.log(`Found ${productsToRun.length} products ready for draw:`, productsToRun);

    const results = [];

    // Process each product
    for (const product of productsToRun) {
      try {
        console.log(`Processing draw for product: ${product.name} (${product.id})`);
        console.log(`Tickets sold: ${product.tickets_sold}/${product.tickets_required}`);

        // Check if required tickets are sold
        if (product.tickets_sold < product.tickets_required) {
          console.log(`Required tickets not reached. Extending draw date by 7 days.`);
          
          // Extend draw date by 7 days
          const currentDrawDate = new Date(product.draw_date);
          const newDrawDate = new Date(currentDrawDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          
          const { error: extendError } = await supabaseClient
            .from("products")
            .update({ draw_date: newDrawDate.toISOString() })
            .eq("id", product.id);

          if (extendError) {
            console.error(`Error extending draw date for ${product.id}:`, extendError);
            results.push({ 
              product_id: product.id, 
              status: "error", 
              error: extendError.message 
            });
          } else {
            results.push({
              product_id: product.id,
              product_name: product.name,
              status: "postponed",
              reason: "Required tickets not reached",
              tickets_sold: product.tickets_sold,
              tickets_required: product.tickets_required,
              new_draw_date: newDrawDate.toISOString(),
            });
          }
          
          continue;
        }

        console.log(`Required tickets reached. Proceeding with draw.`);

        // Get all entries for this product
        const { data: entries, error: entriesError } = await supabaseClient
          .from("entries")
          .select("user_id, tickets_spent")
          .eq("product_id", product.id)
          .eq("status", "pending");

        if (entriesError) {
          console.error(`Error fetching entries for ${product.id}:`, entriesError);
          results.push({ product_id: product.id, status: "error", error: entriesError.message });
          continue;
        }

        if (!entries || entries.length === 0) {
          console.log(`No entries found for product ${product.id}`);
          results.push({ product_id: product.id, status: "no_entries" });
          continue;
        }

        // Calculate weighted random selection based on tickets spent
        const totalTickets = entries.reduce((sum, entry) => sum + entry.tickets_spent, 0);
        const randomValue = Math.random() * totalTickets;
        
        let cumulativeTickets = 0;
        let winnerId = null;

        for (const entry of entries) {
          cumulativeTickets += entry.tickets_spent;
          if (randomValue <= cumulativeTickets) {
            winnerId = entry.user_id;
            break;
          }
        }

        if (!winnerId) {
          winnerId = entries[entries.length - 1].user_id;
        }

        // Generate verification hash
        const verificationData = `${product.id}-${winnerId}-${Date.now()}`;
        const hashBuffer = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(verificationData)
        );
        const verificationHash = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, "0"))
          .join("");

        console.log(`Selected winner: ${winnerId} with hash: ${verificationHash}`);

        // Update product with winner
        const { error: updateProductError } = await supabaseClient
          .from("products")
          .update({
            winner_id: winnerId,
            verification_hash: verificationHash,
          })
          .eq("id", product.id);

        if (updateProductError) {
          console.error(`Error updating product ${product.id}:`, updateProductError);
          results.push({ product_id: product.id, status: "error", error: updateProductError.message });
          continue;
        }

        // Update winner's total wins
        const { error: profileError } = await supabaseClient.rpc(
          "increment_total_wins",
          { user_id: winnerId }
        );

        if (profileError) {
          console.error(`Error updating winner profile:`, profileError);
        }

        // Mark all entries as processed
        const { error: entriesUpdateError } = await supabaseClient
          .from("entries")
          .update({ status: "processed" })
          .eq("product_id", product.id);

        if (entriesUpdateError) {
          console.error(`Error updating entries:`, entriesUpdateError);
        }

        results.push({
          product_id: product.id,
          product_name: product.name,
          winner_id: winnerId,
          verification_hash: verificationHash,
          status: "success",
          total_entries: entries.length,
        });

        console.log(`Successfully completed draw for ${product.name}`);
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({ product_id: product.id, status: "error", error: errorMessage });
      }
    }

    return new Response(
      JSON.stringify({
        message: "Scheduled draws completed",
        processed: productsToRun.length,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Fatal error in scheduled-draws:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
