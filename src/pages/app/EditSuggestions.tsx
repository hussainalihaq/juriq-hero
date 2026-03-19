import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, Filter, Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { getRedlines, type RedlineSuggestion } from "@/lib/apiClient";
import { toast } from "sonner";

type SuggestionStatus = "pending" | "accepted" | "rejected";
type SeverityFilter = "all" | "high" | "medium" | "low";

export default function EditSuggestions() {
  const { id } = useParams();
  const [filter, setFilter] = useState<SeverityFilter>("all");
  const [suggestions, setSuggestions] = useState<RedlineSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, SuggestionStatus>>({});

  const fetchSuggestions = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const text = localStorage.getItem(`doc_text_${id}`);
      if (!text) {
        throw new Error("Document text not found. Please re-upload or select from Documents.");
      }
      const data = await getRedlines(text, 'pro');
      setSuggestions(data);
      setStatuses(Object.fromEntries(data.map((s) => [s.id, "pending"])));
    } catch (err: any) {
      console.error("Failed to fetch redlines:", err);
      setError(err.message);
      toast.error("Failed to generate suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [id]);

  const filtered = suggestions.filter(
    (s) => filter === "all" || s.severity === filter
  );

  const handleAccept = (suggestionId: string) => {
    setStatuses({ ...statuses, [suggestionId]: "accepted" });
    toast.success("Suggestion accepted");
  };

  const handleReject = (suggestionId: string) => {
    setStatuses({ ...statuses, [suggestionId]: "rejected" });
    toast.error("Suggestion rejected");
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Link to={`/app/documents/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-default">
            <ArrowLeft className="h-4 w-4" /> Back to document
          </Link>
          <Button variant="ghost" size="sm" onClick={fetchSuggestions} disabled={loading}>
            <RefreshCcw className={`mr-2 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground">Edit Suggestions (Redline)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Our AI Legal Intelligence has identified potential improvements to protect your interests.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-danger/20 bg-danger/5 p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-danger mb-3" />
            <h3 className="text-lg font-semibold text-foreground">Analysis Error</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">{error}</p>
            <Button variant="outline" onClick={fetchSuggestions}>Try Again</Button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Analyzing Document...</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              Comparing your text against professional legal standards and identifying risks.
            </p>
          </div>
        ) : suggestions.length > 0 ? (
          <>
            {/* Filter */}
            <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground shrink-0">Filter:</span>
              {(["all", "high", "medium", "low"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-default shrink-0 ${filter === level
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>

            {/* Suggestions */}
            <div className="space-y-6">
              {filtered.map((suggestion) => {
                const status = statuses[suggestion.id];
                return (
                  <div
                    key={suggestion.id}
                    className={`rounded-xl border bg-card p-5 transition-default ${status === "accepted"
                        ? "border-success/30 ring-1 ring-success/20"
                        : status === "rejected"
                          ? "border-danger/30 opacity-60"
                          : "border-border/50 shadow-sm hover:shadow-md"
                      }`}
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant={suggestion.severity}>{suggestion.severity.charAt(0).toUpperCase() + suggestion.severity.slice(1)} Risk</Badge>
                        <span className="text-sm font-bold text-foreground">{suggestion.clause}</span>
                        {suggestion.section && <span className="text-xs text-muted-foreground font-mono bg-secondary/50 px-1.5 py-0.5 rounded">{suggestion.section}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        {status === "accepted" && <Badge className="bg-success/10 text-success border-success/20">Accepted</Badge>}
                        {status === "rejected" && <Badge className="bg-danger/10 text-danger border-danger/20">Rejected</Badge>}
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      {/* Original */}
                      <div className="rounded-lg border border-border/30 bg-danger/5 p-4 flex flex-col">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-danger/60">Original (Potential Risk)</span>
                        <p className="text-sm leading-relaxed text-foreground flex-1 italic line-through decoration-danger/30">{suggestion.original}</p>
                      </div>
                      {/* Suggested */}
                      <div className="rounded-lg border border-border/30 bg-success/5 p-4 flex flex-col">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-success/60">Suggested (Pro-Protection)</span>
                        <p className="text-sm leading-relaxed text-foreground flex-1 font-medium">{suggestion.suggested}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-secondary/30 p-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <span className="font-bold text-foreground/70">Reason:</span> {suggestion.reason}
                      </p>
                    </div>

                    {status === "pending" && (
                      <div className="mt-4 flex gap-2">
                        <Button variant="default" size="sm" onClick={() => handleAccept(suggestion.id)} className="bg-success hover:bg-success/90 text-white border-0">
                          <Check className="mr-1 h-3.5 w-3.5" />
                          Accept Change
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleReject(suggestion.id)} className="text-muted-foreground hover:text-danger hover:bg-danger/5">
                          <X className="mr-1 h-3.5 w-3.5" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-2xl">
                  <p className="text-muted-foreground">No suggestions match the current filter.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-2xl">
            <p className="text-muted-foreground">No redline suggestions could be generated for this document.</p>
            <Button variant="link" onClick={fetchSuggestions} className="mt-2">Try again</Button>
          </div>
        )}
      </div>
    </div>
  );
}
