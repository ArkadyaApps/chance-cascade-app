import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useAllEntries } from "@/hooks/useAllEntries";
import { 
  Package, 
  Users, 
  Trophy, 
  Ticket,
  ArrowLeft,
  TrendingUp
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: products } = useProducts();
  const { data: allEntries } = useAllEntries();

  const stats = [
    {
      title: "Total Products",
      value: products?.length || 0,
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Draws",
      value: products?.filter(p => p.status === "active").length || 0,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Entries",
      value: allEntries?.length || 0,
      icon: Ticket,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Completed Draws",
      value: products?.filter(p => p.status === "completed").length || 0,
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const quickActions = [
    {
      title: "Manage Products",
      description: "Add, edit, or remove products",
      icon: Package,
      action: () => navigate("/admin/products"),
    },
    {
      title: "View All Entries",
      description: "See all user entries",
      icon: Users,
      action: () => navigate("/admin/entries"),
    },
    {
      title: "Manage Draws",
      description: "Trigger draws and select winners",
      icon: Trophy,
      action: () => navigate("/admin/draws"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-primary-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-primary-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-primary-foreground/80 ml-14">
            Manage your Lucksy raffle platform
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold">{stat.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.title}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={action.action}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
