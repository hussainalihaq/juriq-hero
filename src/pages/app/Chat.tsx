import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Paperclip,
  Copy,
  AlertTriangle,
  PanelRightOpen,
  PanelRightClose,
  Loader2,
  RefreshCw,
  Sparkles,
  Check,
  FileText,
  X,
  Lock,
  MessageSquare,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPlanDetails } from "@/lib/utils";
import { Link } from "react-router-dom";
import { chatSend, uploadFile, type ChatMessage } from "@/lib/apiClient";
import { toast } from "sonner";
import {
  getChatHistory,
  saveChatHistory,
  getDocHistory,
  saveDocHistory,
  type ChatHistoryItem,
} from "@/components/app/AppSidebar";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface UIMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  loading?: boolean;
  error?: boolean;
  fileName?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const quickActions = [
  "Summarize",
  "Risk analysis",
  "Extract clauses",
  "Find obligations",
  "Rewrite clause",
];

const suggestedPrompts = [
  "Summarize this document in plain English.",
  "Identify the top risks and red flags.",
  "Extract all confidentiality and indemnification clauses.",
  "List all upcoming obligations and hard deadlines.",
  "Rewrite the limit of liability clause to be more protective.",
];

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ------------------------------------------------------------------ */
/*  Markdown Renderer (With Paywall injection)                         */
/* ------------------------------------------------------------------ */
function CustomMarkdown({ content, isFreeTier }: { content: string, isFreeTier: boolean }) {
  // Naive Free Tier Blur Interception
  // If we detect high risk sections and the user is free, we blur a portion of the text
  // To keep it simple, if isFreeTier and text contains "High Risk", we split it.

  let processedContent = content;
  let showPaywall = false;

  if (isFreeTier && (content.toLowerCase().includes("high risk") || content.toLowerCase().includes("red flag"))) {
    showPaywall = true;
    // We just truncate the content to simulate a paywall if it's too long
    const lines = content.split('\n');
    const riskIndex = lines.findIndex(l => l.toLowerCase().includes("high risk") || l.toLowerCase().includes("red flag"));
    if (riskIndex !== -1 && riskIndex < lines.length - 2) {
      processedContent = lines.slice(0, riskIndex + 1).join('\n') + '\n\n...';
    }
  }

  return (
    <div className="prose-juriq relative">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <div className="my-6 w-full overflow-hidden rounded-xl border border-border/50 bg-card/30 shadow-sm">
              <table className="w-full text-sm text-left" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="border-b border-border/50 bg-secondary/50 text-xs font-bold uppercase tracking-widest text-muted-foreground" {...props} />
          ),
          th: ({ node, ...props }) => <th className="px-5 py-4" {...props} />,
          tr: ({ node, ...props }) => <tr className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors" {...props} />,
          td: ({ node, children, ...props }) => {
            // Style cells based on content e.g "High", "Medium", "Low"
            const text = String(children);
            let colorClass = "";
            if (text.includes("High -") || text === "High") colorClass = "text-danger font-semibold";
            else if (text.includes("Medium -") || text === "Medium") colorClass = "text-warning font-semibold";
            else if (text.includes("Low -") || text === "Low") colorClass = "text-success font-semibold";

            return <td className={`px-5 py-3.5 leading-relaxed ${colorClass}`} {...props}>{children}</td>
          },
          blockquote: ({ node, children, ...props }) => {
            const text = String(children).toLowerCase();
            if (text.includes("honest take") || text.includes("high-risk") || text.includes("warning")) {
              return (
                <blockquote className="my-6 rounded-xl border border-warning/40 bg-[#332200]/20 p-5 shadow-sm text-warning/90">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div className="text-sm font-medium leading-relaxed">{children}</div>
                  </div>
                </blockquote>
              );
            }
            return (
              <blockquote className="my-4 border-l-4 border-primary/50 pl-4 italic text-muted-foreground" {...props}>
                {children}
              </blockquote>
            );
          },
          h1: ({ node, ...props }) => <h1 className="mt-6 mb-4 text-xl font-bold text-foreground font-display" {...props} />,
          h2: ({ node, ...props }) => <h2 className="mt-6 mb-3 text-lg font-bold text-foreground font-display" {...props} />,
          h3: ({ node, ...props }) => <h3 className="mt-5 mb-2 text-base font-semibold text-foreground font-display uppercase tracking-wide opacity-90" {...props} />,
          h4: ({ node, ...props }) => <h4 className="mt-4 mb-2 text-sm font-semibold text-foreground tracking-wide" {...props} />,
          p: ({ node, ...props }) => <p className="leading-relaxed text-muted-foreground my-2" {...props} />,
          ul: ({ node, ...props }) => <ul className="my-3 ml-4 space-y-2 text-muted-foreground list-disc marker:text-primary/50" {...props} />,
          ol: ({ node, ...props }) => <ol className="my-3 ml-4 space-y-2 text-muted-foreground list-decimal marker:text-primary/50" {...props} />,
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          code: ({ node, className, children, ...props }) => {
            const isInline = !className?.includes('language-');
            return isInline
              ? <code className="rounded bg-secondary/80 px-1.5 py-0.5 text-xs font-mono text-foreground border border-border/50" {...props}>{children}</code>
              : <div className="rounded-lg overflow-hidden border border-border/50 my-4"><pre className="bg-[#0d1117] p-4 overflow-x-auto text-xs font-mono text-gray-300"><code {...props}>{children}</code></pre></div>
          },
          hr: ({ node, ...props }) => <hr className="my-6 border-border/50" {...props} />
        }}
      >
        {processedContent}
      </ReactMarkdown>

      {showPaywall && (
        <div className="mt-4 relative overflow-hidden rounded-xl border border-danger/30 bg-danger/5 p-5">
          <h4 className="flex items-center gap-2 font-display text-sm font-bold text-danger mb-3">
            <AlertTriangle className="h-4 w-4" /> High Risk Clauses Detected
          </h4>
          <div className="blur-[4px] select-none opacity-50 space-y-2.5 pointer-events-none">
            <div className="h-4 bg-foreground/20 rounded w-full" />
            <div className="h-4 bg-foreground/20 rounded w-5/6" />
            <div className="h-4 bg-foreground/20 rounded w-4/6" />
          </div>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/30 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/95 p-5 shadow-xl backdrop-blur-md">
              <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                <Lock className="h-5 w-5" />
              </div>
              <p className="text-center text-sm font-semibold text-foreground px-2">
                Upgrade to Pro to view critical liabilities.
              </p>
              <Button variant="hero" size="sm" className="mt-1" asChild>
                <Link to="/app/billing">Unlock Premium Analysis</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chat Component                                                     */
/* ------------------------------------------------------------------ */
export default function Chat() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Pull plan details to enforce chat limits
  const { isFreeTier, name: planName } = getUserPlanDetails(user);

  const [chatId, setChatId] = useState<string>("");
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [emptyStateMode, setEmptyStateMode] = useState<"upload" | "chat">("upload");
  const [rightPanel, setRightPanel] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileText, setUploadedFileText] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastAiRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const isEmpty = messages.length === 0;

  // Load existing chat or start new
  useEffect(() => {
    const id = searchParams.get("id");
    const isNew = searchParams.get("new");

    if (isNew) {
      const newId = crypto.randomUUID();
      setChatId(newId);
      setMessages([]);
      return;
    }

    if (id) {
      setChatId(id);
      try {
        const saved = JSON.parse(localStorage.getItem(`juriq_chat_${id}`) || "[]");
        setMessages(saved);
      } catch { setMessages([]); }
    } else {
      const newId = crypto.randomUUID();
      setChatId(newId);
      setMessages([]);
    }
  }, [searchParams]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (!chatId || messages.length === 0) return;
    const toSave = messages.filter(m => !m.loading);
    localStorage.setItem(`juriq_chat_${chatId}`, JSON.stringify(toSave));
  }, [messages, chatId]);

  // Scroll: when a new AI response arrives, scroll to show it from the top
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) return;
    // When user sends, scroll to bottom so they see loading indicator
    if (lastMsg.role === 'user' || lastMsg.loading) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // When AI response arrives, scroll to the start of it
    if (lastMsg.role === 'ai' && !lastMsg.loading && lastAiRef.current) {
      lastAiRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages]);

  // Track scroll position for scroll-down button
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollDown(distFromBottom > 150);
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  /* ---- Save to sidebar history ---- */
  const saveToHistory = useCallback((firstMessage: string) => {
    const history = getChatHistory();
    const exists = history.find(c => c.id === chatId);
    if (!exists) {
      const title = firstMessage.length > 50 ? firstMessage.slice(0, 50) + "…" : firstMessage;
      const newEntry: ChatHistoryItem = {
        id: chatId,
        title,
        createdAt: new Date().toISOString(),
        messageCount: 1,
      };
      saveChatHistory([newEntry, ...history]);
    } else {
      exists.messageCount += 1;
      saveChatHistory(history);
    }
    window.dispatchEvent(new Event("juriq_history_update"));
  }, [chatId]);

  /* ---- Send message ---- */
  const handleSend = async (overrideText?: string) => {
    const text = (overrideText || input).trim();
    if (!text || sending) return;

    // --- Message Limit Enforcer ---
    if (isFreeTier) {
      const userMessageCount = messages.filter(m => m.role === "user").length;
      if (userMessageCount >= 5) {
        toast.error(`You've reached your chat limit on the ${planName} plan. Please upgrade to continue analyzing.`);
        return;
      }
    }

    let fullMessage = text;
    if (uploadedFileText) {
      fullMessage = `[Attached document: ${uploadedFileName}]\n\nDocument text:\n${uploadedFileText}\n\n---\n\nUser question: ${text}`;
    }

    const userMsg: UIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      fileName: uploadedFileName || undefined,
    };

    const loadingMsg: UIMessage = {
      id: crypto.randomUUID(),
      role: "ai",
      content: "",
      timestamp: "",
      loading: true,
    };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput("");
    setSending(true);
    setUploadedFileName(null);
    setUploadedFileText(null);

    // Save to sidebar history (using first user message as title)
    if (messages.length === 0) {
      saveToHistory(text);
    } else {
      saveToHistory(text);
    }

    try {
      const history: ChatMessage[] = messages
        .filter(m => !m.loading && !m.error)
        .map(m => ({ role: m.role, text: m.content }));

      const response = await chatSend(history, fullMessage);

      setMessages(prev =>
        prev.map(m =>
          m.id === loadingMsg.id
            ? { ...m, content: response.text, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), loading: false }
            : m
        )
      );
    } catch (err: any) {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingMsg.id
            ? { ...m, content: err.message || "Something went wrong", loading: false, error: true }
            : m
        )
      );
    } finally {
      setSending(false);
    }
  };

  /* ---- File upload ---- */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile(file);
      setUploadedFileName(result.filename);
      setUploadedFileText(result.extractedText || `[File uploaded: ${result.filename}, ${(result.size / 1024).toFixed(0)}KB]`);

      // Save to doc history
      const docs = getDocHistory();
      docs.unshift({ id: crypto.randomUUID(), filename: result.filename, uploadedAt: new Date().toISOString(), status: "pending" as const });
      saveDocHistory(docs);
      window.dispatchEvent(new Event("juriq_history_update"));
    } catch (err: any) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRetry = (errorMsg: UIMessage) => {
    const idx = messages.findIndex(m => m.id === errorMsg.id);
    const userMsg = messages.slice(0, idx).reverse().find(m => m.role === "user");
    if (userMsg) {
      setMessages(prev => prev.filter(m => m.id !== errorMsg.id));
      handleSend(userMsg.content);
    }
  };

  const handleQuickAction = (action: string) => {
    if (input.trim()) {
      handleSend(`${action}: ${input}`);
    } else {
      setInput(`${action} `);
      textareaRef.current?.focus();
    }
  };

  /* ---- Drag and drop ---- */
  const [dragOver, setDragOver] = useState(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.pdf') || file.name.endsWith('.docx'))) {
      const dt = new DataTransfer();
      dt.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dt.files;
        fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  return (
    <div
      className="flex h-[calc(100vh-3.5rem)]"
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {dragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-primary mb-3" />
            <p className="text-lg font-semibold text-foreground">Drop your document here</p>
            <p className="text-sm text-muted-foreground mt-1">PDF or DOCX files</p>
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex flex-1 flex-col min-w-0">
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 relative">
          <div className="mx-auto max-w-3xl">
            {/* Empty state */}
            {isEmpty && (
              <div className="flex flex-col min-h-[calc(100vh-14rem)] animate-fade-in relative px-4">
                {/* Branding/Hero area (Top) */}
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="rounded-full p-4 accent-soft-bg mb-4">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">How can Juriq help you today?</h2>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">Analyze contracts, identify risks, and get legal insights powered by AI legal intelligence.</p>
                </div>

                {/* Sticky UI area - Toggle + suggestions/upload box */}
                <div className="sticky bottom-0 z-10 bg-gradient-to-t from-background via-background/90 to-transparent pt-12 pb-2 mt-auto">
                  <div className="mx-auto max-w-2xl w-full">
                    {/* Mode Toggle */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center rounded-xl bg-secondary/80 p-1 border border-border/50 shadow-sm backdrop-blur-sm">
                        <button
                          onClick={() => setEmptyStateMode("upload")}
                          className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all ${emptyStateMode === "upload"
                            ? "bg-background text-foreground shadow-md border border-border/50"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                            }`}
                        >
                          <FileText className="h-4 w-4" />
                          Analyze Document
                        </button>
                        <button
                          onClick={() => setEmptyStateMode("chat")}
                          className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all ${emptyStateMode === "chat"
                            ? "bg-background text-foreground shadow-md border border-border/50"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                            }`}
                        >
                          <MessageSquare className="h-4 w-4" />
                          Ask a Question
                        </button>
                      </div>
                    </div>

                    {/* Mode Specific content */}
                    <div className="flex flex-col items-center pb-4">
                      {emptyStateMode === "upload" ? (
                        <div
                          className="w-full cursor-pointer rounded-2xl border-2 border-dashed border-border/50 bg-card/50 p-6 sm:p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-default animate-fade-in shadow-sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FileText className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                          <p className="text-sm font-semibold text-foreground">Upload a contract or legal document</p>
                          <p className="text-xs text-muted-foreground mt-2">PDF · Drag & drop or click to browse</p>
                        </div>
                      ) : (
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fade-in">
                          {suggestedPrompts.slice(0, 4).map((prompt) => (
                            <button
                              key={prompt}
                              onClick={() => handleSend(prompt)}
                              className="w-full rounded-xl border border-border/40 bg-card/80 p-3.5 text-left text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 transition-default flex items-center gap-3 group backdrop-blur-sm transition-all hover:scale-[1.02]"
                            >
                              <div className="rounded-full bg-secondary p-1.5 group-hover:bg-primary/10 group-hover:text-primary transition-colors text-muted-foreground">
                                <MessageSquare className="h-3 w-3" />
                              </div>
                              <span className="flex-1 text-xs sm:text-sm line-clamp-1">{prompt}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, idx) => {
              const isLastAi = msg.role === 'ai' && !msg.loading && idx === messages.length - 1;
              return (
                <div key={msg.id} ref={isLastAi ? lastAiRef : undefined} className="mb-4 sm:mb-6 animate-fade-in">
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] sm:max-w-lg space-y-1">
                        {msg.fileName && (
                          <div className="flex items-center gap-1.5 justify-end text-xs text-muted-foreground mb-1">
                            <FileText className="h-3 w-3" />
                            {msg.fileName}
                          </div>
                        )}
                        <div className="rounded-2xl rounded-tr-sm bg-primary/10 px-4 py-3 text-sm text-foreground">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ) : msg.loading ? (
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="rounded-full p-2 accent-soft-bg shrink-0">
                        <Loader2 className="h-4 w-4 text-primary animate-spin" />
                      </div>
                      <div className="flex-1 space-y-2 py-2">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="h-3.5 rounded bg-secondary animate-pulse" style={{ width: `${90 - j * 20}%` }} />
                        ))}
                      </div>
                    </div>
                  ) : msg.error ? (
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="rounded-full p-2 bg-danger/10 shrink-0">
                        <AlertTriangle className="h-4 w-4 text-danger" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-danger">{msg.content}</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => handleRetry(msg)}>
                          <RefreshCw className="mr-1.5 h-3 w-3" />
                          Retry
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* AI response — inline, no card box */
                    <div className="py-1">
                      <CustomMarkdown content={msg.content} isFreeTier={isFreeTier} />
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="flex items-center gap-1 rounded-md p-1 text-xs text-muted-foreground/60 hover:text-foreground hover:bg-secondary/50 transition-default"
                        >
                          {copiedId === msg.id ? <><Check className="h-3.5 w-3.5 text-success" /></> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <button className="flex items-center gap-1 rounded-md p-1 text-xs text-muted-foreground/60 hover:text-foreground hover:bg-secondary/50 transition-default">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Floating scroll-down arrow */}
          {showScrollDown && !isEmpty && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center h-9 w-9 rounded-full border border-border/50 bg-card/95 backdrop-blur-sm shadow-lg text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200 hover:scale-110"
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-border/50 bg-background px-3 py-3 sm:px-6 sm:py-4">
          <div className="mx-auto max-w-3xl">
            {/* Uploaded file indicator */}
            {uploadedFileName && (
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2.5">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground truncate block">{uploadedFileName}</span>
                  <span className="text-[10px] text-muted-foreground">Ready for analysis</span>
                </div>
                <button
                  onClick={() => { setUploadedFileName(null); setUploadedFileText(null); }}
                  className="shrink-0 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-default"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Quick actions */}
            <div className="mb-2 sm:mb-3 flex flex-wrap gap-1.5 sm:gap-2">
              {quickActions.map(action => (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action)}
                  className="rounded-full border border-border/50 bg-card px-2.5 py-1 text-[11px] sm:px-3 sm:text-xs text-muted-foreground hover:border-border hover:text-foreground transition-default"
                >
                  {action}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-1.5 sm:gap-2 rounded-xl border border-border/50 bg-card p-1.5 sm:p-2">
              <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileUpload} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-default disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
              </button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask about your document or legal question…"
                rows={1}
                className="flex-1 resize-none bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Button
                variant="default"
                size="icon"
                className="shrink-0 h-9 w-9"
                onClick={() => handleSend()}
                disabled={(!input.trim() && !uploadedFileName) || sending}
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground/60">
              Juriq provides informational assistance, not legal advice. AI models can make mistakes.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel toggle */}
      <button
        onClick={() => setRightPanel(!rightPanel)}
        className="hidden lg:flex absolute right-4 top-[4.5rem] z-10 rounded-lg border border-border/50 bg-card p-2 text-muted-foreground hover:text-foreground transition-default"
      >
        {rightPanel ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
      </button>

      {/* Right panel */}
      {rightPanel && (
        <div className="hidden w-80 flex-shrink-0 border-l border-border/50 bg-card lg:block overflow-y-auto animate-slide-in-right">
          <div className="p-5 space-y-6">
            <div className="bg-secondary/20 p-4 rounded-xl border border-border/50">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Settings className="h-3 w-3" /> Chat Info
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Messages</span>
                  <span className="text-foreground font-semibold bg-background px-2 py-0.5 rounded-md border border-border/50 text-xs shadow-sm">
                    {messages.filter((m) => !m.loading).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary" className="text-[10px] font-medium tracking-wide">
                    {sending ? "Thinking…" : "Ready"}
                  </Badge>
                </div>
                {uploadedFileName && (
                  <div className="flex justify-between items-center pt-2 border-t border-border/30 mt-2">
                    <span className="text-muted-foreground">Document</span>
                    <span className="text-foreground font-medium text-xs truncate max-w-[130px]" title={uploadedFileName}>
                      {uploadedFileName}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-secondary/20 p-4 rounded-xl border border-border/50">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-3 w-3" /> Quick Tips
              </h3>
              <div className="space-y-3 leading-relaxed">
                {["Upload a contract to get risk analysis", "Ask about any legal concept", "Use 'Summarize' for quick overviews", "Try 'Find risks' after uploading a doc"].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground bg-background/50 p-2.5 rounded-lg border border-border/30 shadow-sm leading-relaxed">
                    <span className="text-muted-foreground/50 mt-1 shrink-0 text-[10px]">●</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
