import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useWinners } from "@/hooks/useWinners";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ArrowLeft, Trophy, Loader2, Copy, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const AdminDraws = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: products, refetch: refetchProducts } = useProducts();
  const { data: winners, refetch: refetchWinners } = useWinners();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const activeProducts = products?.filter((p) => p.status === "active") || [];

  const handleTriggerDraw = async () => {
    if (!selectedProduct) return;

    setIsDrawing(true);
    setShowConfirm(false);

    try {
      const { data, error } = await supabase.functions.invoke("trigger-draw", {
        body: { productId: selectedProduct },
      });

      if (error) throw error;

      toast.success(t("admin.drawSuccess"), {
        description: `Winner selected with ${data.totalTickets} total tickets from ${data.totalEntries} entries.`,
      });

      refetchProducts();
      refetchWinners();
      setSelectedProduct(null);
    } catch (error: any) {
      console.error("Draw error:", error);
      toast.error(t("common.error"), {
        description: error.message || "An error occurred",
      });
    } finally {
      setIsDrawing(false);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success("Verification hash copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin")}
              className="text-primary-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-primary-foreground">
              {t("admin.draws")}
            </h1>
          </div>
          <p className="text-primary-foreground/80 ml-14">
            Trigger draws and select winners
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Active Draws Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{t("admin.activeDraws")}</h2>
          {activeProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">{t("home.noProducts")}</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeProducts.map((product) => (
                <Card key={product.id} className="p-6">
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Trophy className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p>Draw Date: {format(new Date(product.draw_date), "PPP")}</p>
                    <p>
                      Tickets: {product.tickets_sold} / {product.tickets_required}
                    </p>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedProduct(product.id);
                      setShowConfirm(true);
                    }}
                    disabled={isDrawing}
                  >
                    {isDrawing && selectedProduct === product.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Drawing...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        {t("admin.triggerDraw")}
                      </>
                    )}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Winners Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{t("admin.recentWinners")}</h2>
          {!winners || winners.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">{t("winners.noWinners")}</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {winners.map((winner) => (
                <Card key={winner.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="aspect-square w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {winner.images?.[0] ? (
                        <img
                          src={winner.images[0]}
                          alt={winner.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Trophy className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{winner.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Winner: {winner.winner?.full_name || winner.winner?.email}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Draw Date: {format(new Date(winner.draw_date), "PPP")}
                      </p>
                      {winner.verification_hash && (
                        <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs font-mono">
                          <span className="truncate flex-1">
                            {winner.verification_hash}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={() => copyHash(winner.verification_hash!)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.triggerDraw")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.confirmDraw")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleTriggerDraw}>
              {t("common.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDraws;
