import { Home, Wallet, Ticket, Trophy, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export const BottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Don't show nav on auth page
  if (location.pathname === "/auth") {
    return null;
  }
  
  const navItems = [
    { icon: Home, label: t("nav.home"), path: "/" },
    { icon: Wallet, label: t("nav.wallet"), path: "/wallet" },
    { icon: Ticket, label: t("nav.entries"), path: "/entries" },
    { icon: Trophy, label: t("nav.winners"), path: "/winners" },
    { icon: User, label: t("nav.profile"), path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
