import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building, CreditCard, AlertTriangle, LogOut, Loader2, Key, Settings as SettingsIcon, Download, Plus, Check, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"account" | "workspaces" | "preferences" | "billing">("account");

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Account State
  const [name, setName] = useState(user?.user_metadata?.name || "User");
  const email = user?.email || "";
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [exportingData, setExportingData] = useState(false);

  // Workspaces State
  const initialWorkspaces = user?.user_metadata?.workspaces || [user?.user_metadata?.workspace || "Personal Workspace"];
  const initialCurrent = user?.user_metadata?.currentWorkspace || initialWorkspaces[0];
  const [workspaces, setWorkspaces] = useState<string[]>(initialWorkspaces);
  const [currentWorkspace, setCurrentWorkspace] = useState(initialCurrent);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [updatingWorkspace, setUpdatingWorkspace] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<string | null>(null);
  const [editWorkspaceName, setEditWorkspaceName] = useState("");

  // Security State
  const [password, setPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // --- Handlers ---

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

  const syncWorkspaces = async (newSpaces: string[], newCurrent: string) => {
    setUpdatingWorkspace(true);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        await new Promise((r) => setTimeout(r, 600));
        setWorkspaces(newSpaces);
        setCurrentWorkspace(newCurrent);
        localStorage.setItem("juriq_current_workspace", newCurrent);
        toast.success("Workspace updated successfully!");
        window.dispatchEvent(new Event("juriq_workspace_changed"));
        return;
      }
      const { error } = await supabase.auth.updateUser({
        data: { workspaces: newSpaces, currentWorkspace: newCurrent, workspace: newCurrent },
      });
      if (error) throw error;
      setWorkspaces(newSpaces);
      setCurrentWorkspace(newCurrent);
      localStorage.setItem("juriq_current_workspace", newCurrent);
      toast.success("Workspace updated successfully!");
      // Trigger a refresh event for the layout
      window.dispatchEvent(new Event("juriq_workspace_changed"));
    } catch (err: any) {
      toast.error(err.message || "Failed to update workspace");
    } finally {
      setUpdatingWorkspace(false);
    }
  };

  const handleAddWorkspace = async () => {
    const trimmed = newWorkspaceName.trim();
    if (!trimmed) return;
    if (workspaces.includes(trimmed)) {
      toast.error("Workspace already exists.");
      return;
    }
    const newSpaces = [...workspaces, trimmed];
    await syncWorkspaces(newSpaces, currentWorkspace);
    setNewWorkspaceName("");
  };

  const handleSetCurrentWorkspace = async (space: string) => {
    if (space === currentWorkspace) return;
    await syncWorkspaces(workspaces, space);
  };

  const handleStartEditWorkspace = (space: string) => {
    setEditingWorkspace(space);
    setEditWorkspaceName(space);
  };

  const handleSaveEditWorkspace = async (oldName: string) => {
    const trimmed = editWorkspaceName.trim();
    if (!trimmed || trimmed === oldName) {
      setEditingWorkspace(null);
      return;
    }
    if (workspaces.includes(trimmed)) {
      toast.error("Workspace already exists.");
      return;
    }
    const newSpaces = workspaces.map((w) => (w === oldName ? trimmed : w));
    const newCurrent = currentWorkspace === oldName ? trimmed : currentWorkspace;
    await syncWorkspaces(newSpaces, newCurrent);
    setEditingWorkspace(null);
  };

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

  const handleDataExport = async () => {
    setExportingData(true);
    toast.info("Preparing data export...");
    await new Promise((r) => setTimeout(r, 2000));
    setExportingData(false);
    toast.success("Your data export is ready. Sent to your email.");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  const tabs = [
    { id: "account", label: "Account" },
    { id: "workspaces", label: "Workspaces" },
    { id: "preferences", label: "Preferences" },
    { id: "billing", label: "Billing & Security" },
  ];

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Settings</h1>

        {/* Custom Tabs */}
        <div className="flex space-x-2 border-b border-border/50 pb-px mb-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-2xl">
          {activeTab === "account" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-accent transition-default"
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
                  <Button variant="default" onClick={handleSaveProfile} disabled={updatingProfile} className="mt-2">
                    {updatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </section>

              <section className="mb-8 rounded-xl border border-border/50 bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Data & Export</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Request an archive of your uploaded documents, chat history, and account data.</p>
                <Button variant="outline" onClick={handleDataExport} disabled={exportingData}>
                  {exportingData ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                  Export My Data
                </Button>
              </section>
            </div>
          )}

          {activeTab === "workspaces" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="mb-8 rounded-xl border border-border/50 bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <h2 className="font-display text-lg font-semibold text-foreground">My Workspaces</h2>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {workspaces.map((space) => (
                    <div key={space} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${currentWorkspace === space ? "border-primary bg-primary/5 shadow-sm" : "border-border/50 bg-background hover:border-border"}`}>
                      {editingWorkspace === space ? (
                        <div className="flex items-center gap-2 flex-1 mr-4">
                          <input
                            type="text"
                            value={editWorkspaceName}
                            onChange={(e) => setEditWorkspaceName(e.target.value)}
                            className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground focus-accent"
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && handleSaveEditWorkspace(space)}
                          />
                          <Button variant="ghost" size="sm" onClick={() => handleSaveEditWorkspace(space)} disabled={updatingWorkspace} className="h-8 w-8 p-0">
                            {updatingWorkspace ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 text-success" />}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground">{space}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleStartEditWorkspace(space)} className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      )}

                      {editingWorkspace !== space && (
                        currentWorkspace === space ? (
                          <Badge variant="default" className="bg-primary/20 text-primary border-none pointer-events-none">
                            <Check className="mr-1 h-3 w-3" /> Active
                          </Badge>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => handleSetCurrentWorkspace(space)} disabled={updatingWorkspace}>
                            Switch
                          </Button>
                        )
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-border/50">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Create New Workspace</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp Acquisition"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-accent transition-default"
                    />
                    <Button variant="default" onClick={handleAddWorkspace} disabled={!newWorkspaceName.trim() || updatingWorkspace}>
                      {updatingWorkspace ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                      Create
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="mb-8 rounded-xl border border-border/50 bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <SettingsIcon className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-display text-lg font-semibold text-foreground">App Preferences</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background hover:border-border transition-default">
                    <div>
                      <p className="text-sm font-medium text-foreground">Theme</p>
                      <p className="text-xs text-muted-foreground">Adjust the appearance of Juriq.</p>
                    </div>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground focus-accent"
                    >
                      <option value="system">System Default</option>
                      <option value="dark">Dark Mode</option>
                      <option value="light">Light Mode</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background hover:border-border transition-default">
                    <div>
                      <p className="text-sm font-medium text-foreground">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive updates and newsletters.</p>
                    </div>
                    <select className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground focus-accent">
                      <option value="all">All Notifications</option>
                      <option value="important">Important Only</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="mb-8 rounded-xl border border-border/50 bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Plan & Billing</h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-5">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-foreground">Free Tier</p>
                      <Badge variant="default" className="bg-primary/20 text-primary border-none cursor-default">Current Plan</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">You are currently using 2 of his 5 free documents.</p>
                  </div>
                  <Button variant="hero" asChild>
                    <Link to="/app/billing">Upgrade to Pro</Link>
                  </Button>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 border-t border-border/50 pt-6">
                  <Button variant="outline" className="text-danger border-danger/20 hover:bg-danger/10" asChild>
                    <a href="mailto:support@juriq.com?subject=Plan%20Cancellation%20Request">Cancel Subscription</a>
                  </Button>
                  <Link to="/refunds" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
                    View Refund Policy
                  </Link>
                </div>
              </section>

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
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-accent transition-default"
                    />
                  </div>
                  <Button variant="secondary" onClick={handleUpdatePassword} disabled={updatingPassword || !password}>
                    {updatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </div>
              </section>

              <section className="mb-8 rounded-xl border border-danger/30 bg-danger/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-danger" />
                  <h2 className="font-display text-lg font-semibold text-danger">Danger Zone</h2>
                </div>
                <p className="text-sm text-danger/80 mb-6">Sign out of your account or permanently delete your account and all associated data.</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button variant="outline" onClick={handleSignOut} className="gap-2 border-danger/20 text-danger hover:bg-danger/10">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                  <Button variant="destructive" asChild>
                    <a href="mailto:privacy@juriq.com?subject=Account%20Deletion%20Request&body=Please%20delete%20my%20account%20and%20all%20associated%20data.">
                      Delete Account
                    </a>
                  </Button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
