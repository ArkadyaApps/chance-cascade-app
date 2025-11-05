import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  partner_name?: string;
  partner_description?: string;
  [key: string]: any;
}

interface TranslatedProduct extends Product {
  translatedName: string;
  translatedDescription: string;
  translatedPartnerName?: string;
  translatedPartnerDescription?: string;
}

const translationCache: Record<string, Record<string, string>> = {};

export const useTranslateProduct = (product: Product | null) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [translatedProduct, setTranslatedProduct] = useState<TranslatedProduct | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!product) {
      setTranslatedProduct(null);
      return;
    }

    // If English, no translation needed
    if (currentLanguage === "en") {
      setTranslatedProduct({
        ...product,
        translatedName: product.name,
        translatedDescription: product.description,
        translatedPartnerName: product.partner_name,
        translatedPartnerDescription: product.partner_description,
      });
      return;
    }

    const translateContent = async () => {
      setIsTranslating(true);
      
      try {
        const cacheKey = `${product.id}-${currentLanguage}`;
        
        // Check cache first
        if (translationCache[cacheKey]) {
          setTranslatedProduct({
            ...product,
            translatedName: translationCache[cacheKey].name || product.name,
            translatedDescription: translationCache[cacheKey].description || product.description,
            translatedPartnerName: translationCache[cacheKey].partner_name || product.partner_name,
            translatedPartnerDescription: translationCache[cacheKey].partner_description || product.partner_description,
          });
          setIsTranslating(false);
          return;
        }

        // Translate all fields
        const fieldsToTranslate = [
          { key: "name", value: product.name },
          { key: "description", value: product.description },
          { key: "partner_name", value: product.partner_name },
          { key: "partner_description", value: product.partner_description },
        ].filter(field => field.value);

        const translations = await Promise.all(
          fieldsToTranslate.map(async (field) => {
            const { data, error } = await supabase.functions.invoke("translate-content", {
              body: {
                text: field.value,
                targetLanguage: currentLanguage,
              },
            });

            if (error) {
              console.error(`Translation error for ${field.key}:`, error);
              return { key: field.key, text: field.value }; // Fallback to original
            }

            return { key: field.key, text: data.translatedText || field.value };
          })
        );

        // Build cache and result
        const cacheEntry: Record<string, string> = {};
        const result: any = { ...product };
        
        translations.forEach(({ key, text }) => {
          cacheEntry[key] = text;
          result[`translated${key.charAt(0).toUpperCase()}${key.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase())}`] = text;
        });

        translationCache[cacheKey] = cacheEntry;
        setTranslatedProduct(result);
      } catch (error) {
        console.error("Translation error:", error);
        // Fallback to original content
        setTranslatedProduct({
          ...product,
          translatedName: product.name,
          translatedDescription: product.description,
          translatedPartnerName: product.partner_name,
          translatedPartnerDescription: product.partner_description,
        });
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [product, currentLanguage]);

  return { translatedProduct, isTranslating };
};
