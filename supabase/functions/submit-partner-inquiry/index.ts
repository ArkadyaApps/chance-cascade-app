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

    const {
      companyName,
      contactName,
      email,
      phone,
      website,
      productCategory,
      message,
    } = await req.json();

    console.log("Received partner inquiry from:", email);

    // Validate required fields
    if (!companyName || !contactName || !email || !phone || !productCategory || !message) {
      throw new Error("Missing required fields");
    }

    // Insert inquiry into database
    const { data, error } = await supabase
      .from("partner_inquiries")
      .insert({
        company_name: companyName,
        contact_name: contactName,
        email: email,
        phone: phone,
        website: website || null,
        product_category: productCategory,
        message: message,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    console.log("Partner inquiry saved successfully:", data.id);

    // TODO: Send notification email to admin team
    // You can add email notification logic here using a service like Resend or SendGrid

    return new Response(
      JSON.stringify({
        success: true,
        message: "Inquiry submitted successfully",
        inquiryId: data.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    console.error("Error submitting partner inquiry:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
