import { Link, useLocation } from "react-router-dom";
import {
  MessageSquare,
  FileText,
  Settings,
  CreditCard,
  Plus,
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
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainNav = [
  { title: "Chat", url: "/app/chat", icon: MessageSquare },
  { title: "Documents", url: "/app/documents", icon: FileText },
];

const bottomNav = [
  { title: "Settings", url: "/app/settings", icon: Settings },
  { title: "Billing", url: "/app/billing", icon: CreditCard },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3">
        {/* Logo + Brand — links to landing page */}
        <Link
          to="/"
          className={`flex items-center gap-2 px-1 mb-4 ${collapsed ? "justify-center" : ""}`}
        >
          <img src="/juriq-logo.svg" alt="Juriq" className="h-7 w-7 flex-shrink-0" />
          {!collapsed && (
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Juriq
            </span>
          )}
        </Link>

        {/* New Chat button */}
        {!collapsed && (
          <Button variant="default" size="sm" className="w-full justify-start gap-2" asChild>
            <Link to="/app/chat">
              <Plus className="h-4 w-4" />
              New Chat
            </Link>
          </Button>
        )}
        {collapsed && (
          <Button variant="default" size="icon" className="h-8 w-8" asChild>
            <Link to="/app/chat">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`flex items-center gap-2 ${isActive(item.url)
                          ? "bg-secondary text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {bottomNav.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.url}
                  className={`flex items-center gap-2 ${isActive(item.url)
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
