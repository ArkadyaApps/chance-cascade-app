import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Trophy,
  FileText,
  LogOut,
  ChevronLeft,
  Info,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Entries", url: "/admin/entries", icon: FileText },
  { title: "Draws", url: "/admin/draws", icon: Trophy },
  { title: "About Us", url: "/admin/about-us", icon: Info },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary font-medium border-l-4 border-primary"
      : "hover:bg-muted/50";

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} border-r`}
      collapsible="icon"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Lucksy</p>
            </div>
          )}
          <SidebarTrigger />
        </div>

        {/* Navigation */}
        <SidebarContent className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
              {t("common.navigation")}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
                        className={getNavCls}
                      >
                        <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <Button
            variant="outline"
            size={collapsed ? "icon" : "default"}
            className="w-full"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className={`h-4 w-4 ${collapsed ? "" : "mr-2"}`} />
            {!collapsed && <span>Back to Site</span>}
          </Button>
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className={`h-4 w-4 ${collapsed ? "" : "mr-2"}`} />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </Sidebar>
  );
}
