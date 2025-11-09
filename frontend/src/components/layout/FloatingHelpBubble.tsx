import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, HelpCircle, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FloatingHelpBubble = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the bubble before
    const dismissed = localStorage.getItem("helpBubbleDismissed");
    
    if (!dismissed) {
      // Show after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("helpBubbleDismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 animate-fade-in">
      {!isExpanded ? (
        // Collapsed bubble
        <Button
          onClick={() => setIsExpanded(true)}
          size="lg"
          className="rounded-full h-16 w-16 shadow-2xl bg-gradient-to-br from-primary to-accent hover:scale-110 transition-transform duration-300 animate-bounce"
        >
          <HelpCircle className="w-8 h-8" />
        </Button>
      ) : (
        // Expanded info card
        <Card className="w-80 p-5 shadow-2xl border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5 animate-scale-in">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg">How It Works</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mt-1 -mr-1"
              onClick={handleDismiss}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                1
              </div>
              <p>
                <span className="font-semibold text-foreground">Buy tickets</span> - 
                Purchase ticket packages from the Wallet page
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                2
              </div>
              <p>
                <span className="font-semibold text-foreground">Enter draws</span> - 
                Use your tickets to enter prize draws you like
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                3
              </div>
              <p>
                <span className="font-semibold text-foreground">Win prizes!</span> - 
                Winners are selected randomly when draws close
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsExpanded(false)}
            variant="outline"
            size="sm"
            className="w-full mt-4"
          >
            Got it!
          </Button>
        </Card>
      )}
    </div>
  );
};
