import { useState, useMemo } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { FeaturedCarousel } from "@/components/products/FeaturedCarousel";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useScrollParallax } from "@/hooks/useParallax";

const Index = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const { data: products, isLoading } = useProducts();
  
  const headerParallax = useScrollParallax({ speed: -0.3 });

  // Get unique categories from products
  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    return uniqueCategories.sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.ticket_price - b.ticket_price;
        case "price-high":
          return b.ticket_price - a.ticket_price;
        case "draw-soon":
          return new Date(a.draw_date).getTime() - new Date(b.draw_date).getTime();
        case "draw-later":
          return new Date(b.draw_date).getTime() - new Date(a.draw_date).getTime();
        case "featured":
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [products, searchQuery, categoryFilter, sortBy]);

  const activeFiltersCount = (categoryFilter !== "all" ? 1 : 0) + (sortBy !== "featured" ? 1 : 0);

  const clearFilters = () => {
    setCategoryFilter("all");
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen">
      {/* Header with Parallax */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary to-accent p-4 shadow-lg overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]"
          style={headerParallax}
        />
        <div className="max-w-lg mx-auto relative z-10">
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
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary" size="icon" className="relative">
                  <SlidersHorizontal className="w-4 h-4" />
                  {activeFiltersCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      variant="destructive"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    {t("common.filter")}
                    {activeFiltersCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 px-2"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <Label>{t("common.category")}</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="all">{t("common.allCategories")}</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Options */}
                  <div className="space-y-2">
                    <Label>{t("common.sortBy")}</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="featured">{t("common.featured")}</SelectItem>
                        <SelectItem value="price-low">{t("common.priceLowToHigh")}</SelectItem>
                        <SelectItem value="price-high">{t("common.priceHighToLow")}</SelectItem>
                        <SelectItem value="draw-soon">{t("common.drawDateSoon")}</SelectItem>
                        <SelectItem value="draw-later">{t("common.drawDateLater")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Featured Carousel */}
        {!isLoading && products && products.length > 0 && (
          <FeaturedCarousel products={products} />
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t("home.allDraws")}</h2>
          <span className="text-sm text-muted-foreground">
            {filteredProducts?.length || 0} {t("admin.products").toLowerCase()}
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
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {filteredProducts.map((product) => (
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
