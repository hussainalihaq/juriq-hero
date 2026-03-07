import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
import { useAuth } from "@/contexts/AuthContext";

const features = [
  { icon: FileText, title: "Explain contracts in plain English", desc: "Upload any contract and get a clear, jargon-free summary of what it says and what it means for you." },
  { icon: AlertTriangle, title: "Risk radar: High / Medium / Low", desc: "Every clause gets a severity rating so you know what to negotiate first — from liability traps to overbroad terms." },
  { icon: Edit3, title: "Edit suggestions (before/after)", desc: "Get redline-style revision suggestions with diff highlighting. Review changes at a glance; accept or revise." },
  { icon: PenTool, title: "Draft clauses & emails", desc: "Generate NDA, liability, and termination clauses from scratch — or draft response emails to counterparties." },
  { icon: Shield, title: "Case & law explanations (best-effort)", desc: "Ask about case law or statutes and get best-effort plain-English summaries to help with research." },
  { icon: FileOutput, title: "Litigation support (best-effort)", desc: "Outline issues, draft questions, and build arguments for hearings — best-effort assistance for your review." },
];

const useCases = [
  { icon: Briefcase, title: "Founders", desc: "Contracts, NDAs, vendor terms — fast clarity + risk flags before you sign." },
  { icon: GraduationCap, title: "Students", desc: "Understand legal concepts + break down case material for coursework and exams." },
  { icon: Briefcase, title: "Lawyers", desc: "First-pass contract review + drafting assistance to speed up your workflow." },
  { icon: Users, title: "Teams & Freelancers", desc: "Shared contract review workspace + research help when you need it." },
];

const steps = [
  { num: "01", title: "Upload", desc: "Upload a contract or paste text — PDFs and DOCX supported." },
  { num: "02", title: "Ask", desc: "Ask anything — contracts first; case law and research when needed." },
  { num: "03", title: "Export", desc: "Export notes, summaries, and edits as PDF or DOCX." },
];

import { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function Landing() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="secondary" className="mb-6 px-3 py-1">
              AI legal copilot — contract-first.
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              AI legal copilot for{" "}
              <span className="text-muted-foreground">founders, students,</span>{" "}
              and lawyers.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Contract-first. Understand agreements in plain English, spot risks, and generate edit suggestions — plus quick help with cases, laws, and litigation prep.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {user ? (
                <Button variant="hero" size="xl" asChild>
                  <Link to="/app">Go to Dashboard</Link>
                </Button>
              ) : (
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              )}
              <Button variant="hero-secondary" size="xl" asChild>
                <Link to="/product">View Demo</Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero visual — dashboard mock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-16 max-w-4xl"
          >
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
          </motion.div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-border/30 py-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by early adopters at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            {["Acme Corp", "Vertex Labs", "Northwind", "Fabrikam", "Contoso"].map((name) => (
              <span key={name} className="font-display text-lg font-semibold text-foreground">{name}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2"
        >
          {[
            { quote: "Juriq caught a non-compete clause buried in our NDA that our team missed. It also helped us outline arguments for a vendor dispute — all in one tool.", name: "Alex M.", role: "Startup Founder" },
            { quote: "I use Juriq for contract review and case law research. The risk breakdown makes complex legalese actually understandable, and the case summaries save me hours.", name: "Priya K.", role: "Law Student" },
          ].map((t, i) => (
            <motion.div key={i} variants={itemVariants} className="rounded-xl border border-border/50 bg-card p-6">
              <Quote className="mb-3 h-5 w-5 text-muted-foreground/50" />
              <p className="text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
              <div className="mt-4">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Contract copilot + legal research assistant
            </h2>
            <p className="mt-4 text-muted-foreground">
              From contract analysis and edit suggestions to case law summaries and litigation prep.
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group rounded-xl border border-border/50 bg-card p-6 transition-default hover:border-border hover:bg-secondary/30"
              >
                <div className="mb-4 inline-flex rounded-lg p-2.5 accent-soft-bg">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-border/30 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center font-display text-3xl font-bold text-foreground sm:text-4xl"
          >
            Built for people who deal with legal documents
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {useCases.map((uc, i) => (
              <motion.div key={i} variants={itemVariants} className="rounded-xl border border-border/50 bg-card p-6">
                <uc.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="font-display text-sm font-semibold text-foreground">{uc.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{uc.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/30 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center font-display text-3xl font-bold text-foreground sm:text-4xl"
          >
            How it works
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-8 md:grid-cols-3"
          >
            {steps.map((s) => (
              <motion.div key={s.num} variants={itemVariants} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
                  {s.num}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security snippet */}
      <section className="border-t border-border/30 py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Shield className="mx-auto mb-4 h-8 w-8 text-primary" />
          <h2 className="font-display text-2xl font-bold text-foreground">Your documents stay private</h2>
          <div className="mt-6 grid gap-4 text-left sm:grid-cols-3">
            {[
              "Private by default — your legal documents are never shared or used for training.",
              "Encrypted in transit — all uploads are transmitted securely.",
              "Delete anytime — request full data deletion via support.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/30 py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-lg text-center"
        >
          <h2 className="font-display text-3xl font-bold text-foreground">Get early access</h2>
          <p className="mt-3 text-muted-foreground">
            Join the waitlist and be first to try your AI legal copilot.
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
            {user ? (
              <Button variant="hero" size="lg" className="w-full" asChild>
                <Link to="/app">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button variant="hero" size="lg" className="w-full" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
