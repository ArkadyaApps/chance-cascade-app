import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useDailySpin = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: spinData, isLoading } = useQuery({
    queryKey: ["dailySpin", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("daily_spins")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  const canSpin = () => {
    if (!spinData) return true;
    
    const lastSpinTime = new Date(spinData.last_spin_at).getTime();
    const now = Date.now();
    const hoursPassed = (now - lastSpinTime) / (1000 * 60 * 60);
    
    return hoursPassed >= 24;
  };

  const getTimeUntilNextSpin = () => {
    if (!spinData) return 0;
    
    const lastSpinTime = new Date(spinData.last_spin_at).getTime();
    const nextSpinTime = lastSpinTime + (24 * 60 * 60 * 1000);
    const now = Date.now();
    
    return Math.max(0, nextSpinTime - now);
  };

  const recordSpin = useMutation({
    mutationFn: async (wonTicket: boolean) => {
      if (!user?.id) throw new Error("Not authenticated");

      // Check if record exists
      const { data: existingData } = await supabase
        .from("daily_spins")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from("daily_spins")
          .update({
            last_spin_at: new Date().toISOString(),
            won_ticket: wonTicket,
          })
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from("daily_spins")
          .insert({
            user_id: user.id,
            last_spin_at: new Date().toISOString(),
            won_ticket: wonTicket,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailySpin", user?.id] });
    },
  });

  const addTicketToWallet = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      // Call edge function to handle wallet update server-side
      const { data, error } = await supabase.functions.invoke("daily-spin-reward", {
        body: { wonTicket: true },
      });

      if (error) throw error;
      if (!data.success) throw new Error("Failed to add ticket");

      return data.newBalance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
  });

  return {
    spinData,
    isLoading,
    canSpin: canSpin(),
    timeUntilNextSpin: getTimeUntilNextSpin(),
    recordSpin,
    addTicketToWallet,
  };
};
