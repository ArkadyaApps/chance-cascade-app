import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserEntries } from "@/hooks/useEntries";
import { Clock, Ticket, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const MyEntries = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: entries, isLoading } = useUserEntries();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-primary-foreground">{t("entries.title")}</h1>
          <p className="text-primary-foreground/80">
            {entries?.filter(e => e.status === "active").length || 0} {t("entries.pending").toLowerCase()}
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-24 w-full" />
              </Card>
            ))}
          </>
        ) : !entries || entries.length === 0 ? (
          <Card className="p-8 text-center">
            <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("entries.noEntries")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("entries.startEntering")}
            </p>
          </Card>
        ) : (
          entries.map((entry) => {
            const product = entry.products;
            if (!product) return null;

            const progress = (product.tickets_sold / product.tickets_required) * 100;

            return (
              <Card
                key={entry.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="flex gap-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-3 space-y-2">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold line-clamp-1">
                          {product.name}
                        </h3>
                        <Badge
                          variant={
                            entry.status === "won"
                              ? "default"
                              : entry.status === "lost"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {t(`entries.${entry.status}`)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Ticket className="w-3 h-3" />
                          <span>{entry.tickets_spent} {t("entries.ticketsSpent").toLowerCase()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatDistanceToNow(new Date(product.draw_date), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={progress} className="h-1.5" />
                      <div className="text-xs text-muted-foreground">
                        {product.tickets_sold}/{product.tickets_required} tickets sold
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyEntries;
