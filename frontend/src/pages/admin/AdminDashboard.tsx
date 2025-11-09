import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useProducts } from "@/hooks/useProducts";
import { useAllEntries } from "@/hooks/useAllEntries";
import { 
  Package, 
  Trophy, 
  Ticket,
  TrendingUp,
  Users,
  FileText
} from "lucide-react";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: products } = useProducts();
  const { data: allEntries } = useAllEntries();

  const stats = [
    {
      title: t("admin.totalProducts"),
      value: products?.length || 0,
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: t("admin.activeDraws"),
      value: products?.filter(p => p.status === "active").length || 0,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: t("admin.totalEntries"),
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
      title: t("admin.products"),
      description: "Add, edit, or remove products",
      icon: Package,
      action: () => navigate("/admin/products"),
    },
    {
      title: "User Management",
      description: "Manage user accounts and roles",
      icon: Users,
      action: () => navigate("/admin/users"),
    },
    {
      title: t("admin.entries"),
      description: "See all user entries",
      icon: FileText,
      action: () => navigate("/admin/entries"),
    },
    {
      title: t("admin.draws"),
      description: "Trigger draws and select winners",
      icon: Trophy,
      action: () => navigate("/admin/draws"),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("admin.dashboard")}</h1>
        <p className="text-muted-foreground">
          Manage your Lucksy raffle platform
        </p>
      </div>

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow hover:border-primary/50"
                onClick={action.action}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Icon className="w-8 h-8 text-primary" />
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
  );
};

export default AdminDashboard;
