import { Outlet, Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, CreditCard, LogOut, AlertTriangle } from "lucide-react";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [showAck, setShowAck] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const ack = localStorage.getItem("juriq_first_use_ack");
      if (!ack) setShowAck(true);
    }
  }, [loading, user]);

  const handleAck = () => {
    localStorage.setItem("juriq_first_use_ack", "true");
    setShowAck(false);
  };

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

              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    {initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{name}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/app/settings" className="w-full cursor-pointer flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/app/billing" className="w-full cursor-pointer flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-danger focus:text-danger focus:bg-danger/10 cursor-pointer"
                    onClick={async () => {
                      await signOut();
                      navigate("/signin");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {showAck && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl border border-border/50 bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="font-display text-lg font-bold text-foreground">Welcome to Juriq</h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Before you get started, please acknowledge the following:</p>
              <ul className="list-inside list-disc space-y-2">
                <li><strong className="text-foreground">Juriq is not a law firm</strong> and does not provide legal advice.</li>
                <li>Using Juriq does <strong className="text-foreground">not create an attorney-client relationship</strong>.</li>
                <li>Juriq is an AI tool. Outputs may be incomplete or inaccurate and should be reviewed before relying on them.</li>
              </ul>
              <p className="pt-2">Juriq is for informational assistance only.</p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleAck} variant="hero" className="w-full">
                I Understand & Agree
              </Button>
            </div>
          </div>
        </div>
      )}

    </SidebarProvider>
  );
}
