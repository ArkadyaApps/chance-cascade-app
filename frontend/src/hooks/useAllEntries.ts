import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAllEntries = () => {
  return useQuery({
    queryKey: ["allEntries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entries")
        .select(`
          *,
          products (
            id,
            name,
            images,
            draw_date,
            category,
            status
          ),
          profiles (
            id,
            email,
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
