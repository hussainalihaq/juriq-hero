import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Paperclip,
  Copy,
  ExternalLink,
  FileText,
  AlertTriangle,
  Shield,
  CreditCard,
  PanelRightOpen,
  PanelRightClose,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { mockChatMessages } from "@/data/mockData";

type ViewState = "empty" | "loaded" | "loading" | "error";

const quickActions = [
  "Summarize",
  "Find risks",
  "Explain simply",
  "Draft clause",
  "Edit suggestions",
];

const suggestedPrompts = [
  "Summarize this contract and list the key terms",
  "What are the biggest risks in this document?",
  "Explain the liability clause in simple terms",
];

const clauseNav = [
  { label: "Termination", count: 2 },
  { label: "Liability", count: 3 },
  { label: "Confidentiality", count: 1 },
  { label: "Payment", count: 2 },
  { label: "IP", count: 1 },
];

export default function Chat() {
  const [viewState, setViewState] = useState<ViewState>("loaded");
  const [input, setInput] = useState("");
  const [rightPanel, setRightPanel] = useState(false);
  const messages = mockChatMessages;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-3xl">
            {viewState === "empty" && (
              <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
                <div className="rounded-full p-4 accent-soft-bg mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">Start a conversation</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Upload a document or ask a question to get started.
                </p>
                <div className="mt-8 space-y-2 w-full max-w-md">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => { setInput(prompt); setViewState("loaded"); }}
                      className="w-full rounded-lg border border-border/50 bg-card p-3 text-left text-sm text-muted-foreground hover:border-border hover:text-foreground transition-default"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {viewState === "loading" && (
              <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="mt-4 text-sm text-muted-foreground">Analyzing your document…</p>
                {/* Skeleton */}
                <div className="mt-8 w-full max-w-2xl space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 rounded bg-secondary animate-pulse" style={{ width: `${80 - i * 15}%` }} />
                  ))}
                </div>
              </div>
            )}

            {viewState === "error" && (
              <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
                <div className="rounded-full p-4 bg-danger/10 mb-4">
                  <AlertTriangle className="h-8 w-8 text-danger" />
                </div>
                <h2 className="font-display text-lg font-bold text-foreground">Something went wrong</h2>
                <p className="mt-2 text-sm text-muted-foreground">We couldn't process your request. Please try again.</p>
                <Button variant="outline" className="mt-4" onClick={() => setViewState("loaded")}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </div>
            )}

            {viewState === "loaded" && (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="animate-fade-in">
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="max-w-lg rounded-xl bg-primary/10 px-4 py-3 text-sm text-foreground">
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Summary */}
                        {msg.summary && (
                          <div className="rounded-xl border border-border/50 bg-card p-5">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</span>
                              <button className="text-muted-foreground hover:text-foreground transition-default">
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground">{msg.summary}</p>
                          </div>
                        )}

                        {/* Risks */}
                        {msg.risks && (
                          <div className="rounded-xl border border-border/50 bg-card p-5">
                            <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Risks</span>
                            <div className="space-y-3">
                              {msg.risks.map((risk, i) => (
                                <div key={i} className="flex items-start gap-3">
                                  <Badge variant={risk.severity} className="mt-0.5 shrink-0">
                                    {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                                  </Badge>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{risk.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{risk.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Edit suggestions */}
                        {msg.editSuggestions && (
                          <div className="rounded-xl border border-border/50 bg-card p-5">
                            <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Edits</span>
                            <div className="space-y-3">
                              {msg.editSuggestions.map((edit, i) => (
                                <div key={i} className="rounded-lg bg-secondary/30 p-3 text-xs">
                                  <p className="text-danger line-through">{edit.original}</p>
                                  <p className="mt-2 text-success">{edit.suggested}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Clauses */}
                        {msg.clauses && (
                          <div className="rounded-xl border border-border/50 bg-card p-5">
                            <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clause Highlights</span>
                            <div className="space-y-2">
                              {msg.clauses.map((clause, i) => (
                                <div key={i} className="flex items-start justify-between gap-3 rounded-lg bg-secondary/30 p-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary" className="text-[10px]">{clause.label}</Badge>
                                      <span className="text-[10px] text-muted-foreground">{clause.section}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{clause.excerpt}</p>
                                  </div>
                                  <button className="shrink-0 text-link hover:text-foreground transition-default">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border/50 bg-background px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            {/* Quick actions */}
            <div className="mb-3 flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => setInput(action)}
                  className="rounded-full border border-border/50 bg-card px-3 py-1 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-default"
                >
                  {action}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 rounded-xl border border-border/50 bg-card p-2">
              <button className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-default">
                <Paperclip className="h-4 w-4" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your document…"
                rows={1}
                className="flex-1 resize-none bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Button variant="default" size="icon" className="shrink-0 h-9 w-9">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
              Juriq can make mistakes. Review important information.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel toggle button */}
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
            {/* Document context */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Document Context</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Parties", "Acme Corp, Beta Inc"],
                  ["Effective", "Jan 15, 2025"],
                  ["Expires", "Jan 15, 2027"],
                  ["Governing Law", "Delaware"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk radar */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Risk Radar</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-danger/10 p-3 text-center">
                  <p className="font-display text-2xl font-bold text-danger">2</p>
                  <p className="text-[10px] text-danger">High</p>
                </div>
                <div className="rounded-lg bg-warning/10 p-3 text-center">
                  <p className="font-display text-2xl font-bold text-warning">1</p>
                  <p className="text-[10px] text-warning">Medium</p>
                </div>
                <div className="rounded-lg bg-success/10 p-3 text-center">
                  <p className="font-display text-2xl font-bold text-success">1</p>
                  <p className="text-[10px] text-success">Low</p>
                </div>
              </div>
            </div>

            {/* Clause navigator */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Clause Navigator</h3>
              <div className="space-y-1.5">
                {clauseNav.map((c) => (
                  <button
                    key={c.label}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-default"
                  >
                    <span>{c.label}</span>
                    <Badge variant="secondary" className="text-[10px]">{c.count}</Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
