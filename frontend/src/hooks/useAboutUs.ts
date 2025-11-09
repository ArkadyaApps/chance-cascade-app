import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAboutUsContent = () => {
  return useQuery({
    queryKey: ["about-us-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_us_content")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateAboutUs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: {
      hero_title?: string;
      hero_description?: string;
      mission_title?: string;
      mission_description?: string;
      feature_1_title?: string;
      feature_1_description?: string;
      feature_2_title?: string;
      feature_2_description?: string;
      feature_3_title?: string;
      feature_3_description?: string;
      feature_4_title?: string;
      feature_4_description?: string;
      contact_title?: string;
      contact_description?: string;
    }) => {
      // Get the first (and only) record
      const { data: existing } = await supabase
        .from("about_us_content")
        .select("id")
        .single();

      if (!existing) throw new Error("About Us content not found");

      const { data, error } = await supabase
        .from("about_us_content")
        .update(updates)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-us-content"] });
    },
  });
};
