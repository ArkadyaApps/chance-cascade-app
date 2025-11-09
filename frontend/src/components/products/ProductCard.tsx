import { Database } from "@/integrations/supabase/types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CountdownTimer } from "./CountdownTimer";
import { useMouseParallax } from "@/hooks/useParallax";
import { useRef } from "react";
import { useTranslateProduct } from "@/hooks/useTranslateProduct";
import { Skeleton } from "@/components/ui/skeleton";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const cardParallax = useMouseParallax({ ref: cardRef, intensity: 8 });
  const imageParallax = useMouseParallax({ ref: imageRef, intensity: 12 });
  
  const { translatedProduct, isTranslating } = useTranslateProduct(product);
  
  const progress = (product.tickets_sold / product.tickets_required) * 100;
  const ticketsRemaining = product.tickets_required - product.tickets_sold;

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-border"
      style={cardParallax}
    >
      {/* Product Image */}
      <div ref={imageRef} className="relative aspect-square overflow-hidden">
        <div
          style={imageParallax}
          className="w-full h-full"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover scale-110 transition-transform duration-300 hover:scale-125"
          />
        </div>
        {product.featured && (
          <Badge className="absolute top-2 left-2 text-xs bg-accent">Featured</Badge>
        )}
        <Badge className="absolute top-2 right-2 text-xs bg-secondary">
          {product.category}
        </Badge>
      </div>

      {/* Product Info */}
      <div className="p-3 space-y-2">
        <div>
          {isTranslating ? (
            <>
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-full" />
            </>
          ) : (
            <>
              <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">
                {translatedProduct?.translatedName || product.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {translatedProduct?.translatedDescription || product.description}
              </p>
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 bg-muted/30 p-2 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Ticket Sales</span>
            <span className="font-bold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-muted" 
          />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {product.tickets_sold.toLocaleString()} sold
            </span>
            <span className={`font-medium ${ticketsRemaining > 0 ? 'text-orange-500' : 'text-green-500'}`}>
              {ticketsRemaining > 0 
                ? `${ticketsRemaining.toLocaleString()} remaining` 
                : 'Fully booked!'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pt-1.5 border-t border-border">
            <div className="flex items-center gap-1 text-xs">
              <Ticket className="w-3 h-3 text-primary" />
              <span className="font-semibold">{product.ticket_price}</span>
            </div>
          </div>
          <CountdownTimer targetDate={product.draw_date} compact />
        </div>
      </div>
    </div>
  );
};
