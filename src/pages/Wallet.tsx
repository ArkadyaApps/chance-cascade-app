import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useWalletTransactions } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, Trophy, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

const ticketPackages = [
  { tickets: 10, price: 9.99, priceId: "price_1SQ8uJK2pvACY45ZdIGiKyFY", popular: false },
  { tickets: 50, price: 44.99, priceId: "price_1SQ8uZK2pvACY45ZZvwwEmU6", popular: true, bonus: 5 },
  { tickets: 100, price: 84.99, priceId: "price_1SQ8uaK2pvACY45Z7HglVrtx", popular: false, bonus: 15 },
  { tickets: 500, price: 399.99, priceId: "price_1SQ8uaK2pvACY45ZuqfCPxn7", popular: false, bonus: 100 },
];

const Wallet = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: transactions, isLoading: transactionsLoading } = useWalletTransactions();

  const handlePurchase = async (pkg: typeof ticketPackages[0]) => {
    try {
      setIsProcessing(true);
      
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          priceId: pkg.priceId,
          packageName: `${pkg.tickets}${pkg.bonus ? ` + ${pkg.bonus} bonus` : ''} tickets`,
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 pb-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-primary-foreground mb-6">{t("wallet.title")}</h1>
          
          {/* Balance Card */}
          <Card className="bg-card/95 backdrop-blur-sm border-none shadow-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <WalletIcon className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground">{t("wallet.balance")}</span>
            </div>
            {profileLoading ? (
              <Skeleton className="h-12 w-32 mb-4" />
            ) : (
              <div className="text-4xl font-bold mb-4">{profile?.wallet_balance || 0}</div>
            )}
            <Button 
              className="w-full bg-gradient-to-r from-primary to-accent"
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("wallet.addTickets")}
            </Button>
          </Card>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6 -mt-4">
        {/* Ticket Packages */}
        <div id="packages" className="space-y-4">
          <h2 className="text-xl font-semibold">{t("wallet.selectPackage")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {ticketPackages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative p-4 cursor-pointer transition-all ${
                  selectedPackage === index
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedPackage(index)}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-accent">
                    Popular
                  </Badge>
                )}
                {pkg.bonus && (
                  <Badge className="absolute -top-2 -left-2 bg-green-500">
                    +{pkg.bonus} Bonus
                  </Badge>
                )}
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold">{pkg.tickets}</div>
                  <div className="text-xs text-muted-foreground">{t("wallet.tickets")}</div>
                  <div className="text-lg font-semibold text-primary">
                    ${pkg.price}
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={isProcessing}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(pkg);
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
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
          <h2 className="text-xl font-semibold">{t("wallet.transactions")}</h2>
          <div className="space-y-2">
            {transactionsLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-16 w-full" />
                  </Card>
                ))}
              </>
            ) : transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "purchase"
                            ? "bg-green-500/10"
                            : transaction.type === "win"
                            ? "bg-accent/10"
                            : "bg-primary/10"
                        }`}
                      >
                        {transaction.type === "purchase" ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-500" />
                        ) : transaction.type === "win" ? (
                          <Trophy className="w-4 h-4 text-accent" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(transaction.created_at), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`font-semibold ${
                        transaction.amount > 0 ? "text-green-500" : "text-foreground"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">{t("wallet.noTransactions")}</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
