import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building, CreditCard, AlertTriangle, LogOut, Loader2, Key, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.user_metadata?.name || "User");
  const email = user?.email || "";
  const [workspace, setWorkspace] = useState(user?.user_metadata?.workspace || "My Workspace");

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingWorkspace, setUpdatingWorkspace] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setUpdatingProfile(true);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        await new Promise((r) => setTimeout(r, 600));
        toast.success("Profile updated successfully!");
        return;
      }
      const { error } = await supabase.auth.updateUser({
        data: { name: name.trim() },
      });
      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdateWorkspace = async () => {
    if (!workspace.trim()) return;
    setUpdatingWorkspace(true);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        await new Promise((r) => setTimeout(r, 600));
        toast.success("Workspace updated successfully!");
        return;
      }
      const { error } = await supabase.auth.updateUser({
        data: { workspace: workspace.trim() },
      });
      if (error) throw error;
      toast.success("Workspace updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update workspace");
    } finally {
      setUpdatingWorkspace(false);
    }
  };

  const [password, setPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setUpdatingPassword(true);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        await new Promise((r) => setTimeout(r, 800));
        toast.success("Password updated successfully!");
        setPassword("");
        return;
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully!");
      setPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-foreground mb-8">Settings</h1>

        {/* Profile */}
        <section className="mb-8 rounded-xl border border-border/50 bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold text-foreground">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
            <Button variant="default" size="sm" onClick={handleSaveProfile} disabled={updatingProfile}>
              {updatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </section>

        {/* Workspace */}
        <section className="mb-8 rounded-xl border border-border/50 bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold text-foreground">Workspace</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Workspace Name</label>
              <input
                type="text"
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-accent"
              />
            </div>
            <Button variant="default" size="sm" onClick={handleUpdateWorkspace} disabled={updatingWorkspace}>
              {updatingWorkspace && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </div>
        </section>

        {/* Security & Password */}
        <section className="mb-8 rounded-xl border border-border/50 bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Key className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold text-foreground">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">New Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-accent"
              />
            </div>
            <Button variant="default" size="sm" onClick={handleUpdatePassword} disabled={updatingPassword || !password}>
              {updatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </div>
        </section>

        {/* Preferences */}
        <section className="mb-8 rounded-xl border border-border/50 bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold text-foreground">Preferences</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-secondary/10">
              <div>
                <p className="text-sm font-medium text-foreground">Theme</p>
                <p className="text-xs text-muted-foreground">Adjust the appearance of Juriq.</p>
              </div>
              <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground">
                <option value="system">System Default</option>
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
              </select>
            </div>
          </div>
        </section>

        {/* Plan */}
        <section className="mb-8 rounded-xl border border-border/50 bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold text-foreground">Plan</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Pro Plan</p>
              <p className="text-xs text-muted-foreground">$29/month · 50 documents/month</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/pricing">View Plans</Link>
            </Button>
          </div>
        </section>

        {/* Danger zone & Sign out */}
        <section className="rounded-xl border border-danger/30 bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-danger" />
            <h2 className="font-display text-lg font-semibold text-danger">Account Actions</h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
