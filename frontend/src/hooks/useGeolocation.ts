import { useQuery } from "@tanstack/react-query";

interface GeolocationResponse {
  status: string;
  country: string;
  countryCode: string;
  city: string;
}

export const useGeolocation = () => {
  return useQuery({
    queryKey: ["geolocation"],
    queryFn: async () => {
      // Check localStorage first
      const cached = localStorage.getItem("user_country");
      if (cached) {
        return JSON.parse(cached);
      }

      try {
        const response = await fetch("http://ip-api.com/json/");
        const data: GeolocationResponse = await response.json();
        
        if (data.status === "success") {
          const result = {
            country: data.country,
            countryCode: data.countryCode,
            city: data.city,
          };
          localStorage.setItem("user_country", JSON.stringify(result));
          return result;
        }
        
        throw new Error("Geolocation failed");
      } catch (error) {
        console.error("Geolocation error:", error);
        // Fallback to default country
        const fallback = { country: "United States", countryCode: "US", city: "" };
        localStorage.setItem("user_country", JSON.stringify(fallback));
        return fallback;
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
