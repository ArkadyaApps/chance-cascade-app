import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.79.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DrawRequest {
  productId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Verify admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (roleError || roleData?.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    const { productId }: DrawRequest = await req.json();

    if (!productId) {
      throw new Error('Product ID is required');
    }

    console.log(`Starting draw for product: ${productId}`);

    // Get product details
    const { data: product, error: productError } = await supabaseClient
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      throw new Error('Product not found');
    }

    if (product.status !== 'active') {
      throw new Error('Product is not active');
    }

    // Get all entries for this product
    const { data: entries, error: entriesError } = await supabaseClient
      .from('entries')
      .select('user_id, tickets_spent')
      .eq('product_id', productId)
      .eq('status', 'active');

    if (entriesError) {
      throw new Error('Failed to fetch entries');
    }

    if (!entries || entries.length === 0) {
      throw new Error('No entries found for this product');
    }

    console.log(`Found ${entries.length} entries`);

    // Create weighted array based on tickets spent
    const weightedEntries: string[] = [];
    entries.forEach(entry => {
      for (let i = 0; i < entry.tickets_spent; i++) {
        weightedEntries.push(entry.user_id);
      }
    });

    console.log(`Total weighted entries: ${weightedEntries.length}`);

    // Select random winner
    const randomIndex = Math.floor(Math.random() * weightedEntries.length);
    const winnerId = weightedEntries[randomIndex];

    console.log(`Selected winner: ${winnerId}`);

    // Generate verification hash
    const timestamp = new Date().toISOString();
    const salt = crypto.randomUUID();
    const hashInput = `${winnerId}-${productId}-${timestamp}-${salt}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const verificationHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log(`Generated verification hash: ${verificationHash}`);

    // Update product with winner and status
    const { error: updateError } = await supabaseClient
      .from('products')
      .update({
        winner_id: winnerId,
        verification_hash: verificationHash,
        status: 'completed',
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Failed to update product:', updateError);
      throw new Error('Failed to update product with winner');
    }

    // Update winner's profile
    const { data: winnerProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('total_wins')
      .eq('id', winnerId)
      .single();

    if (!profileError && winnerProfile) {
      await supabaseClient
        .from('profiles')
        .update({ total_wins: winnerProfile.total_wins + 1 })
        .eq('id', winnerId);
    }

    // Mark all entries for this product as processed
    await supabaseClient
      .from('entries')
      .update({ status: 'processed' })
      .eq('product_id', productId);

    console.log('Draw completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        winnerId,
        verificationHash,
        totalEntries: entries.length,
        totalTickets: weightedEntries.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in trigger-draw function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
