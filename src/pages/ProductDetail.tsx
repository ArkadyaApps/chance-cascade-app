import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { useProfile } from "@/hooks/useProfile";
import { useCreateEntry } from "@/hooks/useEntries";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Ticket, Minus, Plus, Shield, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: product, isLoading } = useProduct(id!);
  const { data: profile } = useProfile();
  const createEntry = useCreateEntry();
  const [ticketCount, setTicketCount] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-4">
        <div className="max-w-lg mx-auto p-4 space-y-4">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const progress = (product.tickets_sold / product.tickets_required) * 100;
  const ticketsRemaining = product.tickets_required - product.tickets_sold;
  const totalCost = ticketCount * product.ticket_price;
  const canAfford = totalCost <= (profile?.wallet_balance || 0);

  const handleEnterDraw = async () => {
    if (!canAfford) {
      toast({
        title: "Insufficient tickets",
        description: "You don't have enough tickets. Please purchase more.",
        variant: "destructive",
      });
      navigate("/wallet");
      return;
    }

    try {
      await createEntry.mutateAsync({
        productId: product.id,
        ticketsSpent: totalCost,
      });

      toast({
        title: "Entry successful! 🎉",
        description: `You've entered the draw with ${ticketCount} ticket${ticketCount > 1 ? 's' : ''}`,
      });
      navigate("/entries");
    } catch (error: any) {
      toast({
        title: "Entry failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-lg mx-auto p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Product Details</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.featured && (
            <Badge className="absolute top-4 left-4 bg-accent">Featured</Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <Badge variant="secondary">{product.category}</Badge>
            </div>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Draw Progress */}
          <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Draw Progress</span>
              <span className="text-sm text-muted-foreground">
                {product.tickets_sold}/{product.tickets_required} tickets
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  Draws {formatDistanceToNow(new Date(product.draw_date), { addSuffix: true })}
                </span>
              </div>
              <span className="font-medium">{ticketsRemaining} left</span>
            </div>
          </div>

          {/* Ticket Counter */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Entry Cost</p>
              <div className="flex items-center justify-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">
                  {product.ticket_price} ticket{product.ticket_price > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                disabled={ticketCount <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="text-center min-w-20">
                <div className="text-3xl font-bold">{ticketCount}</div>
                <div className="text-xs text-muted-foreground">entries</div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTicketCount(Math.min(50, ticketCount + 1))}
                disabled={ticketCount >= 50}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Total cost: <span className="font-bold text-foreground">{totalCost} tickets</span>
              {' • '}
              Your balance: <span className="font-bold text-foreground">{profile?.wallet_balance || 0} tickets</span>
            </div>

            <Button
              onClick={handleEnterDraw}
              disabled={!canAfford || createEntry.isPending}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              {createEntry.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entering...
                </>
              ) : canAfford ? (
                `Enter Draw (${totalCost} tickets)`
              ) : (
                "Insufficient Tickets"
              )}
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>Blockchain verified • Fair draw guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
