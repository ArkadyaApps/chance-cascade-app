import { useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Index = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products, isLoading } = useProducts();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary to-accent p-4 shadow-lg">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-primary-foreground">Lucksy</h1>
            <LanguageSwitcher />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder={t("common.search") + "..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/95 border-none"
              />
            </div>
            <Button variant="secondary" size="icon">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t("home.allDraws")}</h2>
          <span className="text-sm text-muted-foreground">
            {products?.length || 0} {t("admin.products").toLowerCase()}
          </span>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {products
              .filter(product => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("home.noProducts")}</p>
            <p className="text-sm text-muted-foreground mt-2">{t("home.checkBack")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
