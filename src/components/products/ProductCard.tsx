import { Product } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const progress = (product.ticketsSold / product.ticketsRequired) * 100;
  const ticketsRemaining = product.ticketsRequired - product.ticketsSold;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-border"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.featured && (
          <Badge className="absolute top-3 left-3 bg-accent">Featured</Badge>
        )}
        <Badge className="absolute top-3 right-3 bg-secondary">
          {product.category}
        </Badge>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Draw Progress</span>
            <span className="font-medium">
              {product.ticketsSold}/{product.ticketsRequired}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{ticketsRemaining} tickets remaining</span>
            <span>{Math.round(progress)}% sold</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-sm">
            <Ticket className="w-4 h-4 text-primary" />
            <span className="font-semibold">{product.ticketPrice} ticket{product.ticketPrice > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatDistanceToNow(new Date(product.drawDate), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
