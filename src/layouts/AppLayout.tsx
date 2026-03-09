import { Outlet, Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout() {
  const { user, loading } = useAuth();

  // Show nothing while checking auth session initially
  if (loading) return null;

  // Protect app routes: if not logged in, redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Get initials from email or metadata
  const name = user.user_metadata?.name || user.email || "User";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-display font-semibold text-foreground">Juriq</span>
              <span>/</span>
              <span>{user.user_metadata?.workspace || "Workspace"}</span>
            </div>
            <div className="ml-auto flex items-center gap-4">

              {/* MRR Optimization: Persistent Usage Nudge */}
              <div className="hidden sm:flex items-center gap-3 mr-2">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Free Tier</span>
                  <span className="text-xs font-semibold text-foreground">2 / 5 Documents</span>
                </div>
                <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[40%] bg-primary transition-all duration-500" />
                </div>
                <Button variant="default" size="sm" className="ml-2 h-8 text-xs bg-gradient-to-r from-primary to-primary/80" asChild>
                  <Link to="/app/billing">Upgrade</Link>
                </Button>
              </div>

              {/* User Avatar */}
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary-foreground"
                title={user.email}
              >
                {initials}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
