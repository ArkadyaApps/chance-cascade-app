import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockUserEntries, mockProducts } from "@/lib/mockData";
import { Clock, Ticket } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const MyEntries = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-primary-foreground">My Entries</h1>
          <p className="text-primary-foreground/80 mt-1">
            {mockUserEntries.length} active draw{mockUserEntries.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {mockUserEntries.length === 0 ? (
          <Card className="p-8 text-center">
            <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No active entries</h3>
            <p className="text-muted-foreground mb-4">
              Start entering draws to see them here
            </p>
          </Card>
        ) : (
          mockUserEntries.map((entry) => {
            const product = mockProducts.find((p) => p.id === entry.productId);
            if (!product) return null;

            const progress = (product.ticketsSold / product.ticketsRequired) * 100;

            return (
              <Card
                key={entry.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/product/${entry.productId}`)}
              >
                <div className="flex gap-4">
                  <img
                    src={entry.productImage}
                    alt={entry.productName}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-3 space-y-2">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold line-clamp-1">
                          {entry.productName}
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
                          {entry.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Ticket className="w-3 h-3" />
                          <span>{entry.ticketsSpent} entries</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatDistanceToNow(new Date(entry.drawDate), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={progress} className="h-1.5" />
                      <div className="text-xs text-muted-foreground">
                        {product.ticketsSold}/{product.ticketsRequired} tickets sold
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
