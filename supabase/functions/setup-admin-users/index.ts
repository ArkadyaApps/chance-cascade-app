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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const adminUsers = [
      { email: "netcorez13@gmail.com", password: "LucksyAdmin" },
      { email: "arkadyaproperties@gmail.com", password: "LucksyAdmin" },
      { email: "artteabcn@gmail.com", password: "LucksyAdmin" },
    ];

    const results = [];

    for (const admin of adminUsers) {
      let userId: string | undefined;

      // Try to create user
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
      });

      if (userData?.user?.id) {
        // User was created successfully
        userId = userData.user.id;
      } else if (userError?.message.includes("already been registered")) {
        // User already exists, get their ID (case-insensitive search)
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers.users.find(u => 
          u.email?.toLowerCase() === admin.email.toLowerCase()
        );
        userId = existingUser?.id;
      } else if (userError) {
        // Other error occurred
        results.push({ email: admin.email, success: false, error: userError.message });
        continue;
      }

      if (!userId) {
        results.push({ email: admin.email, success: false, error: "Could not get user ID" });
        continue;
      }

      // Assign admin role (upsert to handle existing roles)
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

      if (roleError) {
        results.push({ email: admin.email, success: false, error: roleError.message });
      } else {
        results.push({ email: admin.email, success: true, userId: userId });
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error setting up admin users:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
