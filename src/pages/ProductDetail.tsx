import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { useProfile } from "@/hooks/useProfile";
import { useCreateEntry } from "@/hooks/useEntries";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Ticket, Minus, Plus, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { CountdownTimer } from "@/components/products/CountdownTimer";
import logo from "@/assets/logo.png";
import { useTranslateProduct } from "@/hooks/useTranslateProduct";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: product, isLoading } = useProduct(id!);
  const { data: profile } = useProfile();
  const createEntry = useCreateEntry();
  const [ticketCount, setTicketCount] = useState(1);
  const { translatedProduct, isTranslating } = useTranslateProduct(product || null);

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
      <div className="sticky top-0 z-40 border-b border-border" style={{ backgroundColor: '#F5F5DC' }}>
        <div className="max-w-lg mx-auto p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <img src={logo} alt="Lucksy" className="h-8" />
          <div className="w-10" /> {/* Spacer for centering */}
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
              {isTranslating ? (
                <>
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-6 w-20" />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">
                    {translatedProduct?.translatedName || product.name}
                  </h2>
                  <Badge variant="secondary">{product.category}</Badge>
                </>
              )}
            </div>
            {isTranslating ? (
              <Skeleton className="h-4 w-full mt-2" />
            ) : (
              <p className="text-muted-foreground">
                {translatedProduct?.translatedDescription || product.description}
              </p>
            )}
          </div>

          {/* Partner Information */}
          {product.partner_name && (
            <div className="bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-xl p-4 border border-border">
              <div className="flex items-start gap-3">
                {product.partner_logo_url ? (
                  <div className="w-16 h-16 rounded-lg bg-card flex items-center justify-center p-2 border border-border shrink-0">
                    <img
                      src={product.partner_logo_url}
                      alt={product.partner_name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-primary">
                      {product.partner_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-1">Offered by</div>
                  {isTranslating ? (
                    <>
                      <Skeleton className="h-6 w-32 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </>
                  ) : (
                    <>
                      {product.partner_website ? (
                        <a
                          href={product.partner_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-lg hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          {translatedProduct?.translatedPartnerName || product.partner_name}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      ) : (
                        <div className="font-semibold text-lg">
                          {translatedProduct?.translatedPartnerName || product.partner_name}
                        </div>
                      )}
                      {product.partner_description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {translatedProduct?.translatedPartnerDescription || product.partner_description}
                        </p>
                      )}
                      <Badge variant="outline" className="mt-2 text-xs">
                        Official Partner
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Draw Progress */}
          <div className="bg-secondary/30 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Draw Progress</span>
              <span className="text-sm text-muted-foreground">
                {product.tickets_sold}/{product.tickets_required} tickets
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{ticketsRemaining} tickets remaining</span>
              <span className="text-muted-foreground">{Math.round(progress)}% sold</span>
            </div>
            
            {/* Countdown Timer */}
            <div className="pt-2">
              <p className="text-sm font-medium text-center mb-3 text-muted-foreground">Time Remaining</p>
              <CountdownTimer targetDate={product.draw_date} />
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
              Your balance: <button 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/wallet');
                }}
                className="font-bold text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                {profile?.wallet_balance || 0} tickets
                <Ticket className="w-3 h-3" />
              </button>
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
