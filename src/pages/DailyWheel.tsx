import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Gift, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDailySpin } from "@/hooks/useDailySpin";
import { toast } from "sonner";
import { AdMob, RewardAdPluginEvents, AdMobRewardItem } from "@capacitor-community/admob";

const REWARDED_AD_UNIT_ID = "ca-app-pub-3486145054830108/8374647217";

export default function DailyWheel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { canSpin, timeUntilNextSpin, recordSpin, addTicketToWallet, isLoading } = useDailySpin();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wonPrize, setWonPrize] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [loadingAd, setLoadingAd] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Initialize AdMob
    const initializeAdMob = async () => {
      try {
        await AdMob.initialize({
          testingDevices: ['YOUR_DEVICE_ID'],
        });

        // Add listener for reward
        const listener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
          console.log("User earned reward:", reward);
          setAdWatched(true);
          toast.success("Ad watched! You can now spin the wheel.");
        });

        return () => {
          listener.remove();
        };
      } catch (error) {
        console.error("AdMob initialization error:", error);
      }
    };

    initializeAdMob();
  }, []);

  const loadAndShowRewardedAd = async () => {
    try {
      setLoadingAd(true);
      
      await AdMob.prepareRewardVideoAd({
        adId: REWARDED_AD_UNIT_ID,
      });

      await AdMob.showRewardVideoAd();
      
    } catch (error) {
      console.error("Error showing rewarded ad:", error);
      toast.error("Unable to load ad. Please try again.");
      // For development/testing, allow spin without ad
      setAdWatched(true);
    } finally {
      setLoadingAd(false);
    }
  };

  const handleSpin = async () => {
    if (!canSpin) {
      toast.error("You can only spin once every 24 hours!");
      return;
    }

    if (!adWatched) {
      toast.error("Please watch the ad first to spin!");
      return;
    }

    setSpinning(true);
    setShowResult(false);

    // Determine if user wins (10% chance)
    const won = Math.random() < 0.1;
    setWonPrize(won);

    // Calculate random rotation (at least 3 full spins + random position)
    const spins = 3 + Math.random() * 2;
    const finalRotation = won ? 360 * spins : 360 * spins + 180;
    setRotation(finalRotation);

    // Wait for animation to complete
    setTimeout(async () => {
      setSpinning(false);
      setShowResult(true);

      try {
        // Record the spin
        await recordSpin.mutateAsync(won);

        if (won) {
          // Add ticket to wallet
          await addTicketToWallet.mutateAsync();
          toast.success("Congratulations! You won 1 free ticket!");
        } else {
          toast.info("Better luck next time! Come back in 24 hours.");
        }
      } catch (error) {
        console.error("Error recording spin:", error);
        toast.error("An error occurred. Please try again.");
      }

      // Reset ad watched state
      setAdWatched(false);
    }, 4000);
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Gift className="w-6 h-6 text-primary" />
              Daily Lucky Wheel
            </CardTitle>
            <CardDescription>
              Watch an ad and spin once every 24 hours for a chance to win a free ticket!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wheel */}
            <div className="flex justify-center items-center py-8">
              <div className="relative">
                <div
                  className={`w-64 h-64 rounded-full border-8 border-primary shadow-lg transition-transform duration-[4000ms] ease-out`}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    background: "conic-gradient(from 0deg, hsl(var(--primary)) 0deg 180deg, hsl(var(--muted)) 180deg 360deg)",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center">
                      <Gift className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </div>
                {/* Pointer */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-primary" />
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            {!canSpin && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Next spin available in: {formatTimeRemaining(timeUntilNextSpin)}
                </p>
              </div>
            )}

            {canSpin && !adWatched && (
              <Button
                onClick={loadAndShowRewardedAd}
                disabled={loadingAd}
                className="w-full"
                size="lg"
              >
                {loadingAd ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading Ad...
                  </>
                ) : (
                  "Watch Ad to Spin"
                )}
              </Button>
            )}

            {canSpin && adWatched && (
              <Button
                onClick={handleSpin}
                disabled={spinning}
                className="w-full"
                size="lg"
              >
                {spinning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Spinning...
                  </>
                ) : (
                  "Spin the Wheel!"
                )}
              </Button>
            )}

            {/* Result */}
            {showResult && (
              <div className={`text-center p-6 rounded-lg ${wonPrize ? "bg-primary/10 border-2 border-primary" : "bg-muted"}`}>
                <h3 className="text-xl font-bold mb-2">
                  {wonPrize ? "🎉 Congratulations!" : "😢 Not This Time"}
                </h3>
                <p className="text-muted-foreground">
                  {wonPrize
                    ? "You won 1 free ticket! It has been added to your wallet."
                    : "Better luck tomorrow! Come back in 24 hours to try again."}
                </p>
              </div>
            )}

            {/* Info */}
            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>• 10% chance to win a free ticket</p>
              <p>• Spin once every 24 hours</p>
              <p>• Watch the ad to unlock your spin</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
