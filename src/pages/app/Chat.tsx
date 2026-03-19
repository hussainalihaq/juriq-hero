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
import { Link } from "react-router-dom";
import { chatSend, uploadFile, type ChatMessage } from "@/lib/apiClient";
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

/* ------------------------------------------------------------------ */
/*  Markdown Renderer (With Paywall injection)                         */
/* ------------------------------------------------------------------ */
function renderMarkdown(text: string, isFreeTier: boolean) {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Naive Paywall Detection: If the AI output mentions "High Risk" or "Red Flags" 
    // and the user is on the Free Tier, we intercept that section and blur it.
    if (isFreeTier && (line.toLowerCase().includes("high risk") || line.toLowerCase().includes("red flag"))) {
      elements.push(
        <div key={i} className="my-4 relative overflow-hidden rounded-xl border border-danger/30 bg-danger/5 p-4 sm:p-5">
          <h4 className="flex items-center gap-2 font-display text-sm font-bold text-danger mb-2">
            <AlertTriangle className="h-4 w-4" /> High Risk Clauses Detected
          </h4>
          <div className="blur-[4px] select-none opacity-60 space-y-2 pointer-events-none">
            <div className="h-4 bg-foreground/20 rounded w-full" />
            <div className="h-4 bg-foreground/20 rounded w-5/6" />
            <div className="h-4 bg-foreground/20 rounded w-4/6" />
          </div>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/95 p-4 shadow-xl backdrop-blur-md">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Lock className="h-4 w-4" />
              </div>
              <p className="text-center text-xs font-semibold text-foreground px-2">
                Upgrade to Pro to view critical liabilities.
              </p>
              <Button variant="hero" size="sm" className="h-8 text-xs px-3" asChild>
                <Link to="/app/billing">Unlock Premium Analysis</Link>
              </Button>
            </div>
          </div>
        </div>
      );
      // Skip the next few lines that would have detailed the risk
      i += Math.min(3, lines.length - i - 1);
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(<h4 key={i} className="mt-4 mb-1 text-sm font-semibold text-foreground">{line.slice(4)}</h4>);
    } else if (line.startsWith("## ")) {
      elements.push(<h3 key={i} className="mt-5 mb-2 text-sm font-bold text-foreground">{line.slice(3)}</h3>);
    } else if (line.startsWith("# ")) {
      elements.push(<h2 key={i} className="mt-5 mb-2 text-base font-bold text-foreground">{line.slice(2)}</h2>);
    } else if (line.match(/^[-_*]{3,}$/)) {
      elements.push(<hr key={i} className="my-3 border-border/50" />);
    } else if (line.match(/^\s*[-*•]\s/)) {
      elements.push(
        <div key={i} className="flex gap-2 text-sm text-muted-foreground ml-2 my-0.5">
          <span className="text-primary shrink-0">•</span>
          <span dangerouslySetInnerHTML={{ __html: inlineFormat(line.replace(/^\s*[-*•]\s/, "")) }} />
        </div>
      );
    } else if (line.match(/^\s*\d+\.\s/)) {
      const num = line.match(/^\s*(\d+)\./)?.[1];
      elements.push(
        <div key={i} className="flex gap-2 text-sm text-muted-foreground ml-2 my-0.5">
          <span className="text-primary shrink-0 font-medium">{num}.</span>
          <span dangerouslySetInnerHTML={{ __html: inlineFormat(line.replace(/^\s*\d+\.\s/, "")) }} />
        </div>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-sm leading-relaxed text-muted-foreground my-0.5">
          <span dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
        </p>
      );
    }
    i++;
  }
  return <>{elements}</>;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono text-foreground">$1</code>');
}

/* ------------------------------------------------------------------ */
/*  Chat Component                                                     */
/* ------------------------------------------------------------------ */
export default function Chat() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Implicit Free Tier if not explicitly marked as pro/team
  const isFreeTier = user?.user_metadata?.plan !== "pro" && user?.user_metadata?.plan !== "team";

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
              <div className="flex flex-col items-center justify-center py-8 sm:py-16 text-center animate-fade-in">
                <div className="rounded-full p-4 accent-soft-bg mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-6">How can Juriq help you today?</h2>

                {/* Toggle Box */}
                <div className="flex items-center rounded-lg bg-secondary/80 p-1 mb-8 border border-border/50">
                  <button
                    onClick={() => setEmptyStateMode("upload")}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${emptyStateMode === "upload"
                      ? "bg-background text-foreground shadow-sm border border-border/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                      }`}
                  >
                    <FileText className="h-4 w-4" />
                    Analyze Document
                  </button>
                  <button
                    onClick={() => setEmptyStateMode("chat")}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${emptyStateMode === "chat"
                      ? "bg-background text-foreground shadow-sm border border-border/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                      }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Ask a Question
                  </button>
                </div>

                {emptyStateMode === "upload" ? (
                  <div
                    className="w-full max-w-md cursor-pointer rounded-xl border-2 border-dashed border-border/50 bg-card/50 p-6 sm:p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-default animate-fade-in"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                    <p className="text-sm font-medium text-foreground">Upload a contract or legal document</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF or DOCX · Drag & drop or click to browse</p>
                  </div>
                ) : (
                  <div className="w-full max-w-md space-y-2 px-4 sm:px-0 text-left animate-fade-in">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 mb-3">Suggested topics</p>
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="w-full rounded-xl border border-border/50 bg-card p-3 text-left text-sm text-foreground hover:border-primary/50 hover:bg-primary/5 transition-default flex items-center gap-3 group"
                      >
                        <div className="rounded-full bg-secondary p-1.5 group-hover:bg-primary/10 group-hover:text-primary transition-colors text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                        </div>
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
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
                      <div className="prose-juriq">{renderMarkdown(msg.content, isFreeTier)}</div>
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
