import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useWalletTransactions } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, Trophy, Loader2, Sparkles, Ticket, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/layout/AppHeader";

const ticketPackages = [
  { tickets: 10, price: 10.00, priceId: "price_1SRf86K2pvACY45ZJDBl1P7E", popular: false },
  { tickets: 50, price: 50.00, priceId: "price_1SRf87K2pvACY45Z8hSxXxt9", popular: true },
  { tickets: 100, price: 100.00, priceId: "price_1SRf87K2pvACY45ZNbFbyUwb", popular: false },
  { tickets: 500, price: 500.00, priceId: "price_1SRf88K2pvACY45ZESiHloJt", popular: false },
];

const Wallet = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: transactions, isLoading: transactionsLoading } = useWalletTransactions();

  const isProfileComplete = profile?.full_name && profile?.middle_name && profile?.country && profile?.address;

  const handlePurchase = async (pkg: typeof ticketPackages[0]) => {
    // Check if profile is complete before allowing purchase
    if (!profile?.full_name || !profile?.middle_name || !profile?.country || !profile?.address) {
      toast({
        title: "Complete Your Profile",
        description: "Please fill in your Name, Middle Name, Country, and Address in Settings before purchasing tickets.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          priceId: pkg.priceId,
          packageName: `${pkg.tickets} tickets`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: t("common.error"),
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <AppHeader subtitle={t("wallet.balance")} />
      
      {/* Hero Header with Balance */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent pt-4 pb-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djJoLTJ2LTJoMnptMCAwaDJ2MmgtMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-lg mx-auto px-4">
          
          {/* Premium Balance Card */}
          <Card className="bg-card/95 backdrop-blur-xl border-2 border-white/20 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-secondary/20 to-accent/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {t("wallet.balance")}
                </span>
                <Badge variant="outline" className="bg-background/50">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
              
              {profileLoading ? (
                <Skeleton className="h-16 w-48 mb-4" />
              ) : (
                <div className="flex items-baseline gap-2 mb-6">
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {profile?.wallet_balance || 0}
                  </div>
                  <div className="text-muted-foreground font-medium">tickets</div>
                </div>
              )}
              
              <Button 
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-base font-semibold shadow-lg"
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Plus className="w-5 h-5 mr-2" />
                {t("wallet.addTickets")}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-16 pb-8 space-y-8">
        {/* Profile Completion Alert */}
        {!profileLoading && !isProfileComplete && (
          <Card className="bg-amber-500/10 border-amber-500/50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-amber-600 dark:text-amber-500 mb-3">
                  Please fill in your Name, Middle Name, Country, and Address before purchasing tickets.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-amber-500 text-amber-700 hover:bg-amber-500/20"
                  onClick={() => navigate("/settings")}
                >
                  Complete Profile
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Ticket Packages */}
        <div id="packages" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t("wallet.selectPackage")}</h2>
            <Badge variant="secondary" className="text-xs">
              Best Value
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {ticketPackages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative p-5 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedPackage === index
                    ? "ring-2 ring-primary shadow-xl bg-primary/5"
                    : "hover:shadow-lg"
                } ${pkg.popular ? "border-2 border-primary" : ""}`}
                onClick={() => setSelectedPackage(index)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full px-2">
                    <Badge className="w-full justify-center bg-gradient-to-r from-accent to-accent/80 text-xs font-bold shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center space-y-3 pt-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-2">
                    <Ticket className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div>
                    <div className="text-3xl font-bold">{pkg.tickets}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t("wallet.tickets")}</div>
                  </div>
                  
                  <div className="text-2xl font-bold text-primary">
                    ${pkg.price}
                  </div>
                  
                  <Button
                    size="sm"
                    className="w-full h-10 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity font-semibold"
                    disabled={isProcessing}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(pkg);
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("common.loading")}
                      </>
                    ) : (
                      t("wallet.buyNow")
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t("wallet.transactions")}</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary"
              onClick={() => window.location.href = "/payment-history"}
            >
              {t("wallet.viewAll")}
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {transactionsLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-16 w-full" />
                  </Card>
                ))}
              </>
            ) : transactions && transactions.length > 0 ? (
              transactions.slice(0, 5).map((transaction) => (
                <Card key={transaction.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          transaction.type === "purchase"
                            ? "bg-gradient-to-br from-green-500/20 to-green-600/10"
                            : transaction.type === "win"
                            ? "bg-gradient-to-br from-accent/20 to-accent/10"
                            : "bg-gradient-to-br from-primary/20 to-primary/10"
                        }`}
                      >
                        {transaction.type === "purchase" ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : transaction.type === "win" ? (
                          <Trophy className="w-5 h-5 text-accent" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {formatDistanceToNow(new Date(transaction.created_at), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        transaction.amount > 0 ? "text-green-600" : "text-muted-foreground"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center bg-gradient-to-br from-secondary/30 to-accent/10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/30 mb-4">
                  <WalletIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">{t("wallet.noTransactions")}</p>
                <p className="text-sm text-muted-foreground mt-2">Your transaction history will appear here</p>
              </Card>
            )}
          </div>
        </div>

        {/* About Us Link */}
        <div className="text-center pt-4 pb-4">
          <Button
            variant="link"
            className="text-muted-foreground hover:text-primary"
            onClick={() => navigate("/about")}
          >
            About Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
