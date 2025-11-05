import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useWalletTransactions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const usePurchaseTickets = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ amount, price }: { amount: number; price: number }) => {
      if (!user?.id) throw new Error("Not authenticated");

      // Get current balance
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Update wallet balance
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ wallet_balance: profile.wallet_balance + amount })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Create transaction record
      const { data, error: transactionError } = await supabase
        .from("wallet_transactions")
        .insert({
          user_id: user.id,
          type: "purchase",
          amount: amount,
          description: `Purchased ${amount} tickets for $${price}`,
        })
        .select()
        .single();

      if (transactionError) throw transactionError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
  });
};
