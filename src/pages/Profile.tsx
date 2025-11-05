import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Wallet, 
  Trophy, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { mockWalletBalance, mockUserEntries } from "@/lib/mockData";

const Profile = () => {
  const menuItems = [
    { icon: Settings, label: "Account Settings", action: () => {} },
    { icon: Bell, label: "Notifications", action: () => {} },
    { icon: Shield, label: "Security & Privacy", action: () => {} },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 pb-12">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-primary-foreground mb-6">Profile</h1>
          
          {/* User Card */}
          <Card className="bg-card/95 backdrop-blur-sm border-none shadow-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  JD
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-secondary/30 rounded-lg">
                <Wallet className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-2xl font-bold">{mockWalletBalance}</div>
                <div className="text-xs text-muted-foreground">Tickets</div>
              </div>
              <div className="text-center p-3 bg-secondary/30 rounded-lg">
                <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-2xl font-bold">{mockUserEntries.length}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="text-center p-3 bg-secondary/30 rounded-lg">
                <Trophy className="w-5 h-5 text-accent mx-auto mb-1" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">Wins</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4 -mt-6">
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
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </Button>

        {/* Version Info */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          Lucksy v1.0.0 • All rights reserved
        </div>
      </div>
    </div>
  );
};

export default Profile;
