import { useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products, isLoading } = useProducts();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary to-accent p-4 shadow-lg">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-primary-foreground mb-4">Lucksy</h1>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
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
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Draws</h2>
          <span className="text-sm text-muted-foreground">
            {products?.length || 0} products
          </span>
        </div>
        
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </>
        ) : products && products.length > 0 ? (
          products
            .filter(product => 
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.category.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No active draws available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
