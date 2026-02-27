import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  FileText,
  Settings,
  CreditCard,
  Plus,
  Clock,
  Trash2,
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

/* ------------------------------------------------------------------ */
/*  Local storage helpers for chat & doc history                       */
/* ------------------------------------------------------------------ */
export interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: string;
  messageCount: number;
}

export interface DocHistoryItem {
  id: string;
  filename: string;
  uploadedAt: string;
  status: "pending" | "analyzed";
}

export function getChatHistory(): ChatHistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem("juriq_chats") || "[]");
  } catch { return []; }
}

export function saveChatHistory(items: ChatHistoryItem[]) {
  localStorage.setItem("juriq_chats", JSON.stringify(items.slice(0, 20)));
}

export function getDocHistory(): DocHistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem("juriq_docs") || "[]");
  } catch { return []; }
}

export function saveDocHistory(items: DocHistoryItem[]) {
  localStorage.setItem("juriq_docs", JSON.stringify(items.slice(0, 20)));
}

/* ------------------------------------------------------------------ */
/*  Nav items                                                          */
/* ------------------------------------------------------------------ */
const mainNav = [
  { title: "Chat", url: "/app/chat", icon: MessageSquare },
  { title: "Documents", url: "/app/documents", icon: FileText },
];

const bottomNav = [
  { title: "Settings", url: "/app/settings", icon: Settings },
  { title: "Billing", url: "/app/billing", icon: CreditCard },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [docHistory, setDocHistory] = useState<DocHistoryItem[]>([]);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // Load history on mount and when route changes
  useEffect(() => {
    setChatHistory(getChatHistory());
    setDocHistory(getDocHistory());
  }, [location.pathname]);

  // Listen for custom storage events (from Chat.tsx / Documents.tsx)
  useEffect(() => {
    const handler = () => {
      setChatHistory(getChatHistory());
      setDocHistory(getDocHistory());
    };
    window.addEventListener("juriq_history_update", handler);
    return () => window.removeEventListener("juriq_history_update", handler);
  }, []);

  const handleNewChat = () => {
    navigate("/app/chat?new=1");
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = chatHistory.filter((c) => c.id !== id);
    saveChatHistory(updated);
    setChatHistory(updated);
    // Also remove messages from localStorage
    localStorage.removeItem(`juriq_chat_${id}`);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3">
        {/* Logo + Brand */}
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
          <Button variant="default" size="sm" className="w-full justify-start gap-2" onClick={handleNewChat}>
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        )}
        {collapsed && (
          <Button variant="default" size="icon" className="h-8 w-8" onClick={handleNewChat}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Main Nav */}
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

        {/* Chat History */}
        {!collapsed && chatHistory.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <Clock className="h-3 w-3 mr-1" />
              Recent Chats
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-0.5 px-2">
                {chatHistory.slice(0, 8).map((chat) => (
                  <Link
                    key={chat.id}
                    to={`/app/chat?id=${chat.id}`}
                    className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-default"
                  >
                    <MessageSquare className="h-3 w-3 shrink-0 opacity-50" />
                    <span className="flex-1 truncate">{chat.title}</span>
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 shrink-0 text-muted-foreground hover:text-danger transition-default"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Link>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Document History */}
        {!collapsed && docHistory.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <FileText className="h-3 w-3 mr-1" />
              Recent Documents
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-0.5 px-2">
                {docHistory.slice(0, 5).map((doc) => (
                  <Link
                    key={doc.id}
                    to="/app/documents"
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-default"
                  >
                    <FileText className="h-3 w-3 shrink-0 opacity-50" />
                    <span className="flex-1 truncate">{doc.filename}</span>
                  </Link>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
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
