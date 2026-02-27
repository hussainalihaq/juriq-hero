import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockEditSuggestions } from "@/data/mockData";
import { ArrowLeft, Check, X, Filter } from "lucide-react";

type SuggestionStatus = "pending" | "accepted" | "rejected";
type SeverityFilter = "all" | "high" | "medium" | "low";

export default function EditSuggestions() {
  const { id } = useParams();
  const [filter, setFilter] = useState<SeverityFilter>("all");
  const [statuses, setStatuses] = useState<Record<string, SuggestionStatus>>(
    Object.fromEntries(mockEditSuggestions.map((s) => [s.id, s.status]))
  );

  const filtered = mockEditSuggestions.filter(
    (s) => filter === "all" || s.severity === filter
  );

  const handleAccept = (id: string) => setStatuses({ ...statuses, [id]: "accepted" });
  const handleReject = (id: string) => setStatuses({ ...statuses, [id]: "rejected" });

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <Link to={`/app/documents/${id}`} className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-default">
          <ArrowLeft className="h-4 w-4" /> Back to document
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground">Edit Suggestions (redline-style)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Side-by-side comparison of original and suggested text. Accept or reject each change.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
          {(["all", "high", "medium", "low"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-default ${
                filter === level
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
                className={`rounded-xl border bg-card p-5 transition-default ${
                  status === "accepted"
                    ? "border-success/30"
                    : status === "rejected"
                    ? "border-danger/30 opacity-60"
                    : "border-border/50"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={suggestion.severity}>{suggestion.severity.charAt(0).toUpperCase() + suggestion.severity.slice(1)}</Badge>
                    <span className="text-sm font-medium text-foreground">{suggestion.clause}</span>
                    <span className="text-xs text-muted-foreground">{suggestion.section}</span>
                  </div>
                  {status === "accepted" && <Badge variant="low">Accepted</Badge>}
                  {status === "rejected" && <Badge variant="high">Rejected</Badge>}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {/* Original */}
                  <div className="rounded-lg border border-border/30 bg-secondary/20 p-4">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Original</span>
                    <p className="text-sm leading-relaxed text-danger/80">{suggestion.original}</p>
                  </div>
                  {/* Suggested */}
                  <div className="rounded-lg border border-border/30 bg-secondary/20 p-4">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Suggested</span>
                    <p className="text-sm leading-relaxed text-success/80">{suggestion.suggested}</p>
                  </div>
                </div>

                {status === "pending" && (
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleAccept(suggestion.id)}>
                      <Check className="mr-1 h-3.5 w-3.5 text-success" />
                      Accept
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleReject(suggestion.id)}>
                      <X className="mr-1 h-3.5 w-3.5 text-danger" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
