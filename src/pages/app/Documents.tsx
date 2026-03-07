import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Search,
  FileText,
  MessageSquare,
  Edit3,
  Trash2,
  Loader2,
} from "lucide-react";
import { uploadFile } from "@/lib/apiClient";
import { getDocHistory, saveDocHistory, type DocHistoryItem } from "@/components/app/AppSidebar";
import { toast } from "sonner";
import { useRef, useEffect } from "react";

export default function Documents() {
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState<DocHistoryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDocuments(getDocHistory());

    // Listen for updates from other tabs/components
    const handler = () => setDocuments(getDocHistory());
    window.addEventListener("juriq_history_update", handler);
    return () => window.removeEventListener("juriq_history_update", handler);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const loadingToast = toast.loading("Uploading document...");

    try {
      const result = await uploadFile(file);

      const newDoc: DocHistoryItem = {
        id: crypto.randomUUID(),
        filename: result.filename,
        uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "analyzed",
      };

      const limitDocs = [newDoc, ...documents].slice(0, 50);
      saveDocHistory(limitDocs);
      setDocuments(limitDocs);
      window.dispatchEvent(new Event("juriq_history_update"));

      toast.success("Document uploaded successfully!", { id: loadingToast });
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`, { id: loadingToast });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    saveDocHistory(updated);
    setDocuments(updated);
    window.dispatchEvent(new Event("juriq_history_update"));
    toast.success("Document removed");
  };

  const filtered = documents.filter((d) =>
    d.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Documents</h1>
            <p className="mt-1 text-sm text-muted-foreground">Upload and manage your legal documents. Contracts, NDAs, agreements, and more.</p>
          </div>
          <input
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button variant="default" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>

        {/* Upload area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="mb-8 rounded-xl border-2 border-dashed border-border/50 bg-card/50 p-10 text-center hover:border-border transition-default cursor-pointer"
        >
          <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Drag & drop your PDF or DOCX files here, or click to browse.
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Contracts, NDAs, agreements, and other legal documents. Text-based PDFs and DOCX only. Max 20MB.
          </p>
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents…"
            className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-accent"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border/50 bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Uploaded</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-default">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-foreground">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{doc.filename}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    <Badge variant="secondary" className="text-[10px]">
                      {doc.filename.split('.').pop()?.toUpperCase() || "DOC"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{doc.uploadedAt}</td>
                  <td className="px-4 py-3">
                    <Badge variant={doc.status === "analyzed" ? "low" : "medium"} className="text-[10px] capitalize">
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link to={`/app/chat?new=1`} title="Open in chat">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-danger" onClick={() => handleDelete(doc.id)} title="Delete document">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {documents.length === 0 ? "No documents uploaded yet. Upload a document to get started." : "No documents match your search."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
