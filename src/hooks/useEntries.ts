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

      // Use atomic database function to prevent race conditions
      const { data, error } = await supabase.rpc("create_entry_atomic", {
        _user_id: user.id,
        _product_id: productId,
        _tickets_spent: ticketsSpent,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
  });
};
