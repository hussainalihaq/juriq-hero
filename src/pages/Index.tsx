import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Shield,
  AlertTriangle,
  Edit3,
  FileOutput,
  PenTool,
  Upload,
  MessageSquare,
  Download,
  ArrowRight,
  CheckCircle,
  Users,
  GraduationCap,
  Briefcase,
  Quote,
} from "lucide-react";
import { useState } from "react";

const features = [
  { icon: FileText, title: "Plain-English Explanation", desc: "Understand any contract clause without legal jargon." },
  { icon: AlertTriangle, title: "Risk Levels (High/Med/Low)", desc: "Every clause gets a severity rating so you know what to fix first." },
  { icon: Shield, title: "Clause Highlights & References", desc: "See exactly which section contains the risk, with jump-to navigation." },
  { icon: Edit3, title: "Edit Suggestions (Before/After)", desc: "Get redline-style revision suggestions with diff highlighting." },
  { icon: PenTool, title: "Draft Clauses", desc: "Generate NDA, liability, termination clauses from scratch." },
  { icon: FileOutput, title: "Export Summary & Edits", desc: "Export analysis as PDF or suggested edits as DOCX." },
];

const useCases = [
  { icon: Briefcase, title: "Founders", desc: "Review investor agreements, NDAs, and vendor contracts before signing." },
  { icon: GraduationCap, title: "Students", desc: "Learn contract law concepts by analyzing real documents." },
  { icon: Users, title: "Teams", desc: "Share document analysis across your team with a common workspace." },
  { icon: Briefcase, title: "Freelancers", desc: "Spot unfair payment terms and IP clauses in client contracts." },
];

const steps = [
  { num: "01", title: "Upload", desc: "Drop your PDF or DOCX contract into Juriq." },
  { num: "02", title: "Ask", desc: "Ask questions, request summaries, or find risks automatically." },
  { num: "03", title: "Export", desc: "Download your analysis as PDF or edited text as DOCX." },
];

export default function Landing() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 px-3 py-1">
              Now in early access
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Understand contracts.{" "}
              <span className="text-muted-foreground">Spot risks.</span>{" "}
              Draft faster.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Juriq explains legal documents in plain English, flags risky clauses, and suggests edits — so you can sign with confidence.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to="/waitlist">Join Waitlist</Link>
              </Button>
              <Button variant="hero-secondary" size="xl" asChild>
                <Link to="/product">View Demo</Link>
              </Button>
            </div>
          </div>

          {/* Hero visual — dashboard mock */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-2xl shadow-background/80">
              <div className="flex h-8 items-center gap-2 border-b border-border/50 bg-secondary/50 px-4">
                <div className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
              </div>
              <div className="grid grid-cols-1 divide-y divide-border/30 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                {/* Chat preview */}
                <div className="p-5 lg:col-span-2">
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" /> Chat
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">
                      Can you summarize this NDA and flag any risks?
                    </div>
                    <div className="rounded-lg border border-border/30 p-3 text-sm">
                      <p className="mb-2 text-foreground">This is a Mutual NDA between Acme Corp and Beta Inc…</p>
                      <div className="flex gap-2">
                        <Badge variant="high">2 High</Badge>
                        <Badge variant="medium">1 Med</Badge>
                        <Badge variant="low">1 Low</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Risk sidebar */}
                <div className="p-5">
                  <div className="mb-3 text-xs text-muted-foreground">Risk Radar</div>
                  <div className="space-y-2.5">
                    <div className="rounded-md bg-danger/10 p-2.5 text-xs">
                      <span className="font-semibold text-danger">High</span>
                      <p className="mt-1 text-muted-foreground">Unlimited liability clause</p>
                    </div>
                    <div className="rounded-md bg-warning/10 p-2.5 text-xs">
                      <span className="font-semibold text-warning">Medium</span>
                      <p className="mt-1 text-muted-foreground">Broad confidential info definition</p>
                    </div>
                    <div className="rounded-md bg-success/10 p-2.5 text-xs">
                      <span className="font-semibold text-success">Low</span>
                      <p className="mt-1 text-muted-foreground">Standard jurisdiction clause</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-border/30 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            {["Acme Corp", "Vertex Labs", "Northwind", "Fabrikam", "Contoso"].map((name) => (
              <span key={name} className="font-display text-lg font-semibold text-foreground">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {[
            { quote: "Juriq caught a non-compete clause buried in our NDA that our team missed. Saved us months of legal headaches.", name: "Alex M.", role: "Startup Founder" },
            { quote: "I use Juriq to review freelance contracts before signing. The risk breakdown makes complex legalese actually understandable.", name: "Priya K.", role: "Freelance Designer" },
          ].map((t, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card p-6">
              <Quote className="mb-3 h-5 w-5 text-muted-foreground/50" />
              <p className="text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
              <div className="mt-4">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Everything you need to review contracts
            </h2>
            <p className="mt-4 text-muted-foreground">
              From plain-English explanations to export-ready edit suggestions.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="group rounded-xl border border-border/50 bg-card p-6 transition-default hover:border-border hover:bg-secondary/30"
              >
                <div className="mb-4 inline-flex rounded-lg p-2.5 accent-soft-bg">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-border/30 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground sm:text-4xl">
            Built for people who sign things
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((uc, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-card p-6">
                <uc.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="font-display text-sm font-semibold text-foreground">{uc.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/30 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-14 text-center font-display text-3xl font-bold text-foreground sm:text-4xl">
            How it works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
                  {s.num}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security snippet */}
      <section className="border-t border-border/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Shield className="mx-auto mb-4 h-8 w-8 text-primary" />
          <h2 className="font-display text-2xl font-bold text-foreground">Your documents stay private</h2>
          <div className="mt-6 grid gap-4 text-left sm:grid-cols-3">
            {[
              "Private by default — your documents are never shared or used for training.",
              "Encrypted in transit — all uploads are transmitted securely.",
              "Delete anytime — request full data deletion via support.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/30 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">Get early access</h2>
          <p className="mt-3 text-muted-foreground">
            Join the waitlist and be first to try Juriq.
          </p>
          <div className="mt-8 space-y-3">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-accent"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground focus-accent"
            >
              <option value="">Select your role (optional)</option>
              <option value="founder">Founder / CEO</option>
              <option value="legal">Legal Professional</option>
              <option value="student">Student</option>
              <option value="freelancer">Freelancer</option>
              <option value="other">Other</option>
            </select>
            <Button variant="hero" size="lg" className="w-full" onClick={() => {}}>
              Join Waitlist
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
