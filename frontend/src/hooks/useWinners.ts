import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useWinners = () => {
  return useQuery({
    queryKey: ["winners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          images,
          draw_date,
          verification_hash,
          winner:profiles!products_winner_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .eq("status", "completed")
        .not("winner_id", "is", null)
        .order("draw_date", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
};
