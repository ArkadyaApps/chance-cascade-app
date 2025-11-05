import { useWalletTransactions } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt, 
  ArrowLeft, 
  ExternalLink, 
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Trophy,
  CreditCard
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PaymentHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: transactions, isLoading } = useWalletTransactions();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <CreditCard className="w-5 h-5 text-green-500" />;
      case "win":
        return <Trophy className="w-5 h-5 text-accent" />;
      case "spend":
        return <ArrowUpRight className="w-5 h-5 text-primary" />;
      default:
        return <ArrowDownLeft className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTransactionBadgeColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "win":
        return "bg-accent/10 text-accent border-accent/20";
      case "spend":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-primary-foreground hover:text-primary-foreground/80"
            onClick={() => navigate("/wallet")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back")}
          </Button>
          <div className="flex items-center gap-3">
            <Receipt className="w-8 h-8 text-primary-foreground" />
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">
                {t("wallet.paymentHistory")}
              </h1>
              <p className="text-sm text-primary-foreground/80">
                {t("wallet.viewAllTransactions")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 -mt-4">
        {isLoading ? (
          <Card className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </Card>
        ) : transactions && transactions.length > 0 ? (
          <>
            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-full bg-muted">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="font-medium truncate">
                          {transaction.description}
                        </div>
                        <div
                          className={`font-semibold whitespace-nowrap ${
                            transaction.amount > 0 ? "text-green-500" : "text-foreground"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={getTransactionBadgeColor(transaction.type)}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(transaction.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {transaction.stripe_payment_id && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Payment ID:</span>
                        <br />
                        <code className="bg-muted px-1 py-0.5 rounded text-[10px]">
                          {transaction.stripe_payment_id}
                        </code>
                      </div>
                      {transaction.receipt_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(transaction.receipt_url!, "_blank")}
                        >
                          <Download className="w-3 h-3 mr-2" />
                          {t("wallet.viewReceipt")}
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Desktop View */}
            <Card className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("wallet.type")}</TableHead>
                    <TableHead>{t("wallet.description")}</TableHead>
                    <TableHead>{t("wallet.date")}</TableHead>
                    <TableHead className="text-right">{t("wallet.amount")}</TableHead>
                    <TableHead>{t("wallet.paymentId")}</TableHead>
                    <TableHead className="text-right">{t("wallet.receipt")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          <Badge variant="outline" className={getTransactionBadgeColor(transaction.type)}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(transaction.created_at), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(transaction.created_at), "MMM d, yyyy")}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(transaction.created_at), "h:mm a")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`font-semibold ${
                            transaction.amount > 0 ? "text-green-500" : "text-foreground"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.stripe_payment_id ? (
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {transaction.stripe_payment_id.substring(0, 16)}...
                          </code>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {transaction.receipt_url ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(transaction.receipt_url!, "_blank")}
                          >
                            <Receipt className="w-4 h-4 mr-2" />
                            {t("wallet.view")}
                            <ExternalLink className="w-3 h-3 ml-2" />
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        ) : (
          <Card className="p-12 text-center">
            <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">{t("wallet.noTransactions")}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("wallet.noTransactionsDesc")}
            </p>
            <Button onClick={() => navigate("/wallet")}>
              {t("wallet.addTickets")}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
