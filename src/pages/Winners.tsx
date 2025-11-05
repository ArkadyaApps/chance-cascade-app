import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useWinners } from "@/hooks/useWinners";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/layout/AppHeader";

const Winners = () => {
  const { t } = useTranslation();
  const { data: winners, isLoading } = useWinners();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader subtitle={t("winners.congratulations")} />

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Trust Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold mb-1">Blockchain Verified Draws</div>
              <div className="text-muted-foreground">
                Every draw is recorded on the blockchain and can be independently verified.
                Complete transparency guaranteed.
              </div>
            </div>
          </div>
        </Card>

        {/* Winners List */}
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-24 w-full" />
              </Card>
            ))}
          </>
        ) : winners && winners.length > 0 ? (
          winners.map((winner) => {
            const winnerProfile = Array.isArray(winner.winner) ? winner.winner[0] : winner.winner;
            const winnerName = winnerProfile?.full_name || winnerProfile?.email?.split('@')[0] || 'Anonymous';
            
            return (
              <Card key={winner.id} className="overflow-hidden">
                <div className="flex gap-4 p-4">
                  <img
                    src={winner.images[0]}
                    alt={winner.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{winner.name}</h3>
                        <Badge variant="secondary" className="bg-accent/20">
                          <Trophy className="w-3 h-3 mr-1" />
                          {t("product.winner")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Won by {winnerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(winner.draw_date), { addSuffix: true })}
                      </p>
                    </div>
                    {winner.verification_hash && (
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Hash: <span className="font-mono">{winner.verification_hash}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                          >
                            Verify
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-8 text-center">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("winners.noWinners")}</h3>
            <p className="text-muted-foreground">
              {t("winners.firstDraw")}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Winners;
