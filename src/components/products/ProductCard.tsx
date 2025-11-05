import { Database } from "@/integrations/supabase/types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const progress = (product.tickets_sold / product.tickets_required) * 100;
  const ticketsRemaining = product.tickets_required - product.tickets_sold;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-border"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
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
          <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {product.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-xs">
              {product.tickets_sold}/{product.tickets_required}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1.5 border-t border-border">
          <div className="flex items-center gap-1 text-xs">
            <Ticket className="w-3 h-3 text-primary" />
            <span className="font-semibold">{product.ticket_price}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="line-clamp-1">{formatDistanceToNow(new Date(product.draw_date), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
