import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MessageSquare,
  Edit3,
  Download,
  Users,
  Calendar,
  MapPin,
  Lock,
  Loader2,
  AlertCircle,
  FileSearch,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { extractMetadata, type DocumentMetadata } from "@/lib/apiClient";
import { toast } from "sonner";
import { getDocHistory } from "@/components/app/AppSidebar";

export default function DocumentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [doc, setDoc] = useState<DocumentMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docInfo, setDocInfo] = useState<{ name: string, type: string, uploaded: string } | null>(null);

  // Assuming user without 'pro' role is on the Free tier for this demo
  const isFreeTier = user?.user_metadata?.plan !== "pro" && user?.user_metadata?.plan !== "team";

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        // 1. Get basic info from history
        const history = getDocHistory();
        const info = history.find(d => d.id === id);
        if (info) {
          setDocInfo({
            name: info.filename,
            type: info.filename.split('.').pop()?.toUpperCase() || 'PDF',
            uploaded: info.uploadedAt
          });
        }

        // 2. Get text and extract metadata
        const text = localStorage.getItem(`doc_text_${id}`);
        if (!text) {
          throw new Error("Document content not found. Please re-upload.");
        }

        const metadata = await extractMetadata(text);
        setDoc(metadata);
      } catch (err: any) {
        console.error("Metadata error:", err);
        setError(err.message);
        toast.error("Failed to extract document details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-bold text-foreground">Extracting Intelligence...</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          Gemini is analyzing the clauses, parties, and key dates in your document. This takes a few seconds.
        </p>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center max-w-md mx-auto">
        <AlertCircle className="h-12 w-12 text-danger mb-4" />
        <h2 className="text-xl font-bold text-foreground">Analysis Failed</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-6">{error || "Could not retrieve document information."}</p>
        <div className="flex gap-3">
          <Button variant="outline" asChild><Link to="/app/documents">Back to Documents</Link></Button>
          <Button variant="default" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/app/documents" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-default">
          <ArrowLeft className="h-4 w-4" /> Back to documents
        </Link>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{docInfo?.name || doc.type}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-[10px]">{docInfo?.type || doc.type}</Badge>
              <span>{docInfo?.uploaded ? `Uploaded ${docInfo.uploaded}` : 'Recently analyzed'}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm" asChild>
              <Link to={`/app/chat?docId=${id}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Open in Chat
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/app/documents/${id}/edit-suggestions`}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Suggestions
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-border/50 bg-secondary/20 p-5 flex items-start gap-4">
          <FileSearch className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Intelligence Report</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Juriq has automatically identified the following key fields. These extractions are AI-powered but should be verified for mission-critical legal work.
            </p>
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {[
            { icon: Users, label: "Parties", value: doc.parties.join(", ") || 'No parties identified' },
            { icon: Calendar, label: "Effective Date", value: doc.effectiveDate },
            { icon: Calendar, label: "Expiration Date", value: doc.expirationDate },
            { icon: MapPin, label: "Governing Law", value: doc.governingLaw },
            { icon: FileSearch, label: "Document Type", value: doc.type },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border/50 bg-card p-4 shadow-sm hover:border-primary/30 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{item.label}</span>
              </div>
              <p className="text-sm font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Risk summary */}
        <div className="mb-8 rounded-xl border border-border/50 bg-card p-6 relative overflow-hidden shadow-sm">
          <h3 className="mb-6 font-display text-sm font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            Automatic Risk Scoring
          </h3>

          <div className={`grid grid-cols-3 gap-3 ${isFreeTier ? 'blur-md select-none opacity-40' : ''}`}>
            <div className="rounded-xl bg-danger/10 border border-danger/20 p-5 text-center">
              <p className="font-display text-4xl font-bold text-danger">{doc.riskSummary.high}</p>
              <p className="text-xs font-bold text-danger/80 mt-1 uppercase">High Risk</p>
            </div>
            <div className="rounded-xl bg-warning/10 border border-warning/20 p-5 text-center">
              <p className="font-display text-4xl font-bold text-warning">{doc.riskSummary.medium}</p>
              <p className="text-xs font-bold text-warning/80 mt-1 uppercase">Medium</p>
            </div>
            <div className="rounded-xl bg-success/10 border border-success/20 p-5 text-center">
              <p className="font-display text-4xl font-bold text-success">{doc.riskSummary.low}</p>
              <p className="text-xs font-bold text-success/80 mt-1 uppercase">Low</p>
            </div>
          </div>

          {/* Paywall Overlay */}
          {isFreeTier && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[4px]">
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/95 p-8 shadow-2xl backdrop-blur-md max-w-sm text-center">
                <div className="rounded-full bg-primary/10 p-4 text-primary">
                  <Lock className="h-8 w-8" />
                </div>
                <h4 className="font-display text-xl font-bold text-foreground">Premium Risk Intelligence</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade to Juriq Pro to reveal the specific High-Risk liability traps and unfavorable clauses hidden in this document.
                </p>
                <div className="flex flex-col w-full gap-2">
                  <Button variant="default" className="w-full bg-primary text-white" asChild>
                    <Link to="/app/billing">Unlock Now — $19/mo</Link>
                  </Button>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">14-Day Money Back Guarantee</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export buttons */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-lg" onClick={() => toast.info("PDF Exporting...")}>
            <Download className="mr-2 h-4 w-4" />
            Export Summary (PDF)
          </Button>
          <Button variant="outline" className="rounded-lg" onClick={() => toast.info("Generating DOCX...")}>
            <Download className="mr-2 h-4 w-4" />
            Export Suggestions (DOCX)
          </Button>
        </div>
      </div>
    </div>
  );
}
