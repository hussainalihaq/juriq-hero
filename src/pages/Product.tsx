import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  AlertTriangle,
  Edit3,
  FileText,
  Download,
  FolderOpen,
} from "lucide-react";

const sections = [
  {
    icon: MessageSquare,
    title: "Contract Chat + Document Context",
    desc: "Ask questions about any contract and get answers with clause-level references. A context panel shows parties, dates, and key amounts — so you always know where you stand.",
    reverse: false,
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: AlertTriangle,
    title: "Risk Radar + Recommendations",
    desc: "Every clause is evaluated for risk — from liability traps to overbroad definitions. Each finding includes a severity level and a recommended action to help you negotiate smarter.",
    reverse: true,
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-muted-foreground",
  },
  {
    icon: Edit3,
    title: "Edit Suggestions (Before/After)",
    desc: "See side-by-side diffs of original vs. suggested contract text. Insertions and deletions are highlighted so you can review changes at a glance — a clear, redline-style comparison.",
    reverse: false,
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: FolderOpen,
    title: "Document Library",
    desc: "Upload and manage all your legal documents in one place. Search by name, filter by status, and open any document in the chat for instant analysis.",
    reverse: true,
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-muted-foreground",
  },
  {
    icon: Download,
    title: "Case & Law Research (Best-Effort)",
    desc: "Ask about case law, statutes, or legal concepts and get best-effort plain-English summaries. Helpful for research, coursework, and litigation prep — always verify with primary sources.",
    reverse: false,
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
];

function FeatureSection({ s, index }: { s: typeof sections[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      className={`flex flex-col gap-10 lg:flex-row lg:items-center ${s.reverse ? "lg:flex-row-reverse" : ""}`}
    >
      <div className="flex-1">
        <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${s.gradient} p-3 backdrop-blur-sm`}>
          <s.icon className={`h-6 w-6 ${s.iconColor}`} />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground lg:text-3xl">{s.title}</h2>
        <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{s.desc}</p>
      </div>
      <div className="flex-1">
        <div className={`group relative aspect-video overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br ${s.gradient} p-8 flex items-center justify-center transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,hsl(var(--background))_70%)]" />
          <s.icon className="relative h-16 w-16 text-muted-foreground/30 transition-transform duration-500 group-hover:scale-110 group-hover:text-muted-foreground/50" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Product() {
  return (
    <div>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge variant="secondary" className="mb-6 animate-fade-in">Product</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
            Your AI legal copilot
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Contract analysis, risk detection, and drafting help — plus best-effort support for case law and litigation research.
          </p>
        </motion.div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-28">
          {sections.map((s, i) => (
            <FeatureSection key={i} s={s} index={i} />
          ))}
        </div>
      </section>

      <section className="border-t border-border/30 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">Ready to try it?</h2>
          <p className="mt-3 text-muted-foreground">Sign up to get started.</p>
          <Button variant="hero" size="xl" className="mt-6 transition-transform duration-300 hover:scale-105" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
