import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    // Apply RTL for Arabic
    const isRTL = i18n.language === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleLanguageChange = async (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    
    // Save to database if user is logged in
    if (user) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ preferred_language: languageCode })
          .eq("id", user.id);

        if (error) {
          console.error("Error saving language preference:", error);
        }
      } catch (error) {
        console.error("Error saving language preference:", error);
      }
    }
  };

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[50px] border-none bg-transparent shadow-none focus:ring-0">
        <SelectValue>
          {i18n.language.toUpperCase()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-popover z-50">
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <span className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
