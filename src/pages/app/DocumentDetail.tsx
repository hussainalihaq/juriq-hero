import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockDocumentDetail } from "@/data/mockData";
import {
  ArrowLeft,
  MessageSquare,
  Edit3,
  Download,
  FileText,
  Calendar,
  MapPin,
  Users,
  AlertTriangle,
} from "lucide-react";

export default function DocumentDetail() {
  const { id } = useParams();
  const doc = mockDocumentDetail;

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/app/documents" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-default">
          <ArrowLeft className="h-4 w-4" /> Back to documents
        </Link>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{doc.name}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-[10px]">{doc.type}</Badge>
              <span>{doc.pages} pages</span>
              <span>Uploaded {doc.uploaded}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm" asChild>
              <Link to="/app/chat">
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

        <div className="mb-6 rounded-xl border border-border/50 bg-card p-5">
          <p className="text-xs text-muted-foreground mb-3">
            Fields are extracted on a best-effort basis and may not be fully accurate.
          </p>
        </div>

        {/* Metadata grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {[
            { icon: Users, label: "Parties", value: doc.parties.join(", ") },
            { icon: Calendar, label: "Effective Date", value: doc.effectiveDate },
            { icon: Calendar, label: "Expiration Date", value: doc.expirationDate },
            { icon: MapPin, label: "Governing Law", value: doc.governingLaw },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <p className="text-sm font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Risk summary */}
        <div className="mb-8 rounded-xl border border-border/50 bg-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Risk Summary</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-danger/10 p-4 text-center">
              <p className="font-display text-3xl font-bold text-danger">{doc.riskSummary.high}</p>
              <p className="text-xs text-danger mt-1">High Risk</p>
            </div>
            <div className="rounded-lg bg-warning/10 p-4 text-center">
              <p className="font-display text-3xl font-bold text-warning">{doc.riskSummary.medium}</p>
              <p className="text-xs text-warning mt-1">Medium</p>
            </div>
            <div className="rounded-lg bg-success/10 p-4 text-center">
              <p className="font-display text-3xl font-bold text-success">{doc.riskSummary.low}</p>
              <p className="text-xs text-success mt-1">Low</p>
            </div>
          </div>
        </div>

        {/* Export buttons */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Export Summary (PDF)
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Export Edited Text (DOCX)
          </Button>
        </div>
      </div>
    </div>
  );
}
