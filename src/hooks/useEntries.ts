import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserEntries = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["entries", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("entries")
        .select(`
          *,
          products (
            id,
            name,
            images,
            draw_date,
            tickets_required,
            tickets_sold
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useCreateEntry = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      ticketsSpent,
    }: {
      productId: string;
      ticketsSpent: number;
    }) => {
      if (!user?.id) throw new Error("Not authenticated");

      // Start a transaction-like operation
      // 1. Check wallet balance
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      if (profile.wallet_balance < ticketsSpent) {
        throw new Error("Insufficient ticket balance");
      }

      // 2. Create entry
      const { data: entry, error: entryError } = await supabase
        .from("entries")
        .insert({
          user_id: user.id,
          product_id: productId,
          tickets_spent: ticketsSpent,
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // 3. Deduct tickets from wallet
      const { error: walletError } = await supabase
        .from("profiles")
        .update({ wallet_balance: profile.wallet_balance - ticketsSpent })
        .eq("id", user.id);

      if (walletError) throw walletError;

      // 4. Update product tickets_sold
      const { data: product } = await supabase
        .from("products")
        .select("tickets_sold")
        .eq("id", productId)
        .single();

      if (product) {
        await supabase
          .from("products")
          .update({ tickets_sold: product.tickets_sold + ticketsSpent })
          .eq("id", productId);
      }

      // 5. Create wallet transaction
      await supabase.from("wallet_transactions").insert({
        user_id: user.id,
        type: "spend",
        amount: -ticketsSpent,
        description: `Entered draw`,
        product_id: productId,
      });

      return entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
  });
};
