import { Home, ClipboardList, BookOpen, AlertTriangle, Users, BarChart3, HeartHandshake } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type MenuItem = {
  title: string;
  url: string;
  icon: any;
  badge?: number;
};

type AppSidebarProps = {
  userRole: "student" | "staff" | "parent" | "counselor";
};

export function AppSidebar({ userRole }: AppSidebarProps) {
  const [location] = useLocation();

  const getMenuItems = (): MenuItem[] => {
    switch (userRole) {
      case "student":
        return [
          { title: "Home", url: "/", icon: Home },
          { title: "Stories", url: "/stories", icon: BookOpen },
          { title: "Create Story", url: "/story/create", icon: BookOpen },
          { title: "Get Support", url: "/support", icon: HeartHandshake },
        ];
      case "staff":
        return [
          { title: "Dashboard", url: "/staff/dashboard", icon: Home },
          { title: "Surveys", url: "/staff/surveys", icon: ClipboardList },
          { title: "Alerts", url: "/staff/alerts", icon: AlertTriangle, badge: 3 },
          { title: "Analytics", url: "/staff/analytics", icon: BarChart3 },
        ];
      case "counselor":
        return [
          { title: "Dashboard", url: "/counselor/dashboard", icon: Home },
          { title: "Requests", url: "/counselor/requests", icon: Users, badge: 5 },
          { title: "Analytics", url: "/counselor/analytics", icon: BarChart3 },
        ];
      case "parent":
        return [
          { title: "Dashboard", url: "/parent/dashboard", icon: Home },
          { title: "Insights", url: "/parent/insights", icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const getUserName = () => {
    const names = {
      student: "Sarah Johnson",
      staff: "Dr. Michael Chen",
      counselor: "Lisa Anderson",
      parent: "Robert Williams",
    };
    return names[userRole];
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.split(" ").map(n => n[0]).join("");
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
            WH
          </div>
          <div>
            <h2 className="font-semibold text-sm">WellnessHub</h2>
            <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <a href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge className="ml-auto" variant="destructive">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{getUserName()}</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
