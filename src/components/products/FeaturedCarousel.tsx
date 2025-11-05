import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, Ticket } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CountdownTimer } from "./CountdownTimer";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface FeaturedCarouselProps {
  products: Product[];
}

export const FeaturedCarousel = ({ products }: FeaturedCarouselProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const featuredProducts = products.filter(product => product.featured);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-primary fill-primary" />
        <h2 className="text-xl font-bold">{t("home.featured")}</h2>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {featuredProducts.map((product) => {
            const progress = (product.tickets_sold / product.tickets_required) * 100;
            
            return (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
                <Card 
                  className="overflow-hidden cursor-pointer hover-scale transition-all duration-300 hover:shadow-xl border-primary/20"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-primary text-primary-foreground shadow-lg">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {t("admin.featured")}
                      </Badge>
                      <Badge variant="secondary" className="shadow-lg">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{t("product.progress")}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Ticket Price */}
                    <div className="flex items-center gap-2 text-sm">
                      <Ticket className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t("product.ticketPrice")}</p>
                        <p className="font-semibold">{product.ticket_price} {t("wallet.tickets")}</p>
                      </div>
                    </div>

                    {/* Countdown Timer */}
                    <CountdownTimer targetDate={product.draw_date} />

                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      size="sm"
                    >
                      {t("home.viewDetails")}
                    </Button>
                  </div>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4 bg-background/80 backdrop-blur-sm border-primary/20" />
        <CarouselNext className="hidden md:flex -right-4 bg-background/80 backdrop-blur-sm border-primary/20" />
      </Carousel>
    </div>
  );
};
