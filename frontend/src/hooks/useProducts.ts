import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseProductsOptions {
  countryCode?: string;
}

export const useProducts = (options?: UseProductsOptions) => {
  return useQuery({
    queryKey: ["products", options?.countryCode],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      
      // Filter by country on client side if country code is provided
      if (options?.countryCode && data) {
        return data.filter(product => 
          !product.available_countries || 
          product.available_countries.length === 0 || 
          product.available_countries.includes(options.countryCode)
        );
      }
      
      return data;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
