import { Shield, Lock, Trash2, Eye } from "lucide-react";

const items = [
  {
    icon: Eye,
    title: "What we store",
    desc: "When you upload a document, we store the file temporarily to perform analysis. Extracted text and analysis results are stored in your account until you delete them.",
  },
  {
    icon: Lock,
    title: "Encryption in transit",
    desc: "All file uploads and API communication use TLS encryption. We are working toward additional at-rest encryption and will update this page as we make progress.",
  },
  {
    icon: Trash2,
    title: "Data deletion",
    desc: "You can delete any document from your account at any time. For full account data deletion, email support@juriq.com and we will process your request within 7 business days.",
  },
  {
    icon: Shield,
    title: "No data sharing",
    desc: "Your legal documents are never shared with third parties or used to train models. Your legal data is yours alone.",
  },
];

export default function Security() {
  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h1 className="font-display text-4xl font-bold text-foreground">Security</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We take a straightforward approach to security. Here's what we do and what we don't.
          </p>
          <p className="mt-2 text-sm text-muted-foreground/70">
            Juriq provides information and drafting assistance, not legal advice.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {items.map((item, i) => (
            <div key={i} className="flex gap-4 rounded-xl border border-border/50 bg-card p-6">
              <div className="flex-shrink-0">
                <div className="rounded-lg p-2.5 accent-soft-bg">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border/50 bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            We are an early-stage product and do not hold SOC2, ISO 27001, or similar certifications.
            We're building security practices incrementally and will update this page as we grow.
          </p>
        </div>
      </div>
    </div>
  );
}
