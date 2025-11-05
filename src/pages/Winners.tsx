import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface Winner {
  id: string;
  productName: string;
  productImage: string;
  winnerName: string;
  drawDate: string;
  verificationHash: string;
}

const mockWinners: Winner[] = [
  {
    id: "1",
    productName: "iPhone 15 Pro Max",
    productImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
    winnerName: "Sarah M.",
    drawDate: "2025-11-02T20:00:00Z",
    verificationHash: "0x7a8f9b2c...3d4e5f6a",
  },
  {
    id: "2",
    productName: "MacBook Pro 16\"",
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    winnerName: "John D.",
    drawDate: "2025-11-02T20:00:00Z",
    verificationHash: "0x1b2c3d4e...5f6a7b8c",
  },
  {
    id: "3",
    productName: "PlayStation 5 Bundle",
    productImage: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
    winnerName: "Mike R.",
    drawDate: "2025-10-27T20:00:00Z",
    verificationHash: "0x9a8b7c6d...5e4f3a2b",
  },
];

const Winners = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-primary-foreground" />
            <h1 className="text-2xl font-bold text-primary-foreground">Recent Winners</h1>
          </div>
          <p className="text-primary-foreground/80">
            All draws are blockchain verified for transparency
          </p>
        </div>
      </div>

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
        {mockWinners.map((winner) => (
          <Card key={winner.id} className="overflow-hidden">
            <div className="flex gap-4 p-4">
              <img
                src={winner.productImage}
                alt={winner.productName}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-2">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{winner.productName}</h3>
                    <Badge variant="secondary" className="bg-accent/20">
                      <Trophy className="w-3 h-3 mr-1" />
                      Winner
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Won by {winner.winnerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(winner.drawDate), { addSuffix: true })}
                  </p>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Hash: <span className="font-mono">{winner.verificationHash}</span>
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
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Winners;
