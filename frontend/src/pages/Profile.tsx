import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserEntries } from "@/hooks/useEntries";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Wallet,
  Trophy,
  Lock
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/layout/AppHeader";

const Profile = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: entries } = useUserEntries();
  const { isAdmin } = useIsAdmin();
  
  const menuItems = [
    { icon: Settings, label: t("profile.settings"), action: () => navigate("/settings") },
    { icon: Bell, label: "Notifications", action: () => {} },
    { icon: Shield, label: "Security & Privacy", action: () => {} },
    { icon: HelpCircle, label: t("contact.title"), action: () => navigate("/contact") },
  ];

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const activeEntries = entries?.filter(e => e.status === "active").length || 0;
  const wins = profile?.total_wins || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader showLogo={true} />

      <div className="max-w-lg mx-auto px-4 -mt-2">
        {/* User Card */}
        <Card className="bg-card/95 backdrop-blur-sm border-none shadow-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user ? getInitials(user.email || "") : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                {profileLoading ? (
                  <>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{profile?.full_name || "User"}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            {profileLoading ? (
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <Wallet className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-2xl font-bold">{profile?.wallet_balance || 0}</div>
                  <div className="text-xs text-muted-foreground">{t("wallet.balance").split(" ")[0]}</div>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-2xl font-bold">{activeEntries}</div>
                  <div className="text-xs text-muted-foreground">{t("entries.pending")}</div>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <Trophy className="w-5 h-5 text-accent mx-auto mb-1" />
                  <div className="text-2xl font-bold">{wins}</div>
                  <div className="text-xs text-muted-foreground">{t("profile.totalWins").split(" ")[0]}</div>
                </div>
              </div>
          )}
        </Card>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4 mt-4">
        {/* Admin Access */}
        {isAdmin && (
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <button
              onClick={() => navigate("/admin")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <Lock className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">{t("admin.dashboard")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("admin.products")}, {t("admin.draws").toLowerCase()}, {t("admin.users").toLowerCase()}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        )}

        {/* Menu Items */}
        <Card className="divide-y divide-border">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          onClick={signOut}
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="w-5 h-5 mr-3" />
          {t("profile.signOut")}
        </Button>

        {/* About Us Link */}
        <div className="text-center pt-2">
          <Button
            variant="link"
            className="text-muted-foreground hover:text-primary"
            onClick={() => navigate("/about")}
          >
            About Us
          </Button>
        </div>

        {/* Version Info */}
        <div className="text-center text-xs text-muted-foreground pt-2">
          Lucksy v1.0.0 • All rights reserved
        </div>
      </div>
    </div>
  );
};

export default Profile;
