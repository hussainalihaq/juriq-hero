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
  ArrowRight,
  CheckCircle,
  Users,
  GraduationCap,
  Briefcase,
  Quote,
  Sparkles,
  Scale,
  BrainCircuit,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const scrollyFeatures = [
  {
    step: "01",
    title: "Upload & Summarize",
    desc: "Drop any complex PDF or DOCX into Juriq. Within seconds, our AI breaks down the densest legalese into a clean, plain-English summary. Never sign a document you don't fully understand again.",
    icon: Upload,
    visualType: "summary"
  },
  {
    step: "02",
    title: "Instant Risk Radar",
    desc: "Juriq automatically scans every sentence for highly adversarial clauses. We flag unlimited liability traps, aggressive non-competes, and overbroad IP assignments with severity ratings so you know exactly what to negotiate.",
    icon: AlertTriangle,
    visualType: "risk"
  },
  {
    step: "03",
    title: "Suggest & Redline",
    desc: "Don't just find problems—fix them. Juriq generates standard, protective counter-clauses and redlines your document automatically. Accept or reject the AI's suggestions directly in the editor.",
    icon: Edit3,
    visualType: "edit"
  },
  {
    step: "04",
    title: "Chat with your Contract",
    desc: "Got a specific question? Ask Juriq. 'Does this NDA prevent me from working with competitors?' or 'What is the governing law here?' Juriq answers instantly, citing the exact clause.",
    icon: MessageSquare,
    visualType: "chat"
  }
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

      {/* Scrollytelling Features */}
      <section className="relative bg-background py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 -mr-64 -mt-64 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -ml-64 -mb-64 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20 px-4 py-1.5 text-sm">
              <Sparkles className="mr-2 h-4 w-4" /> Next-Generation Legal AI
            </Badge>
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl md:text-6xl tracking-tight">
              An elite legal team,<br />
              <span className="text-muted-foreground">living in your browser.</span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
            {/* Left side: Scrollable Text Content */}
            <div className="w-full lg:w-5/12 space-y-32 py-10">
              {scrollyFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-40% 0px -40% 0px", once: false }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border/50 text-foreground shadow-sm">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-bold text-primary mb-2 tracking-wider">0{i + 1}</div>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Right side: Sticky UI Visualizer */}
            <div className="hidden w-full lg:flex lg:w-7/12 sticky top-32 h-[600px] items-center justify-center">
              <div className="relative w-full aspect-[4/3] rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden">
                {/* Mac window header */}
                <div className="flex h-12 w-full items-center gap-2 border-b border-border/40 bg-background/50 px-5 backdrop-blur-md">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                  <div className="ml-4 flex-1 text-center text-xs text-muted-foreground font-medium flex items-center justify-center gap-2">
                    <Shield className="h-3 w-3" /> juriq-secure-viewer.app
                  </div>
                </div>

                {/* UI Mock Area - Will crossfade based on scroll (using a simplified static complex UI for now due to implementation limits of scrollSpy, but highly visually complex) */}
                <div className="p-6 h-[calc(100%-3rem)] bg-gradient-to-br from-background to-secondary/20 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Floating abstract elements */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-primary/20 bg-primary/5 blur-3xl"
                  />

                  {/* Central App Mock */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full border border-border/50 rounded-xl bg-background shadow-lg overflow-hidden flex flex-col"
                  >
                    {/* Fake App header */}
                    <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-sm">Mutual_NDA_Final.pdf</span>
                        <Badge variant="outline" className="text-[10px] h-5">Analyzed</Badge>
                      </div>
                      <Button variant="default" size="sm" className="h-8">Export</Button>
                    </div>
                    {/* Fake App Body */}
                    <div className="flex flex-1 overflow-hidden">
                      {/* Fake Document */}
                      <div className="w-2/3 border-r border-border p-6 space-y-4">
                        <div className="h-4 w-3/4 bg-secondary rounded-md" />
                        <div className="h-4 w-full bg-secondary rounded-md" />
                        <div className="h-4 w-5/6 bg-secondary rounded-md" />

                        <div className="my-6 p-4 border border-danger/30 bg-danger/5 rounded-lg relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-danger" />
                          <div className="flex gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-danger" />
                            <span className="text-xs font-bold text-danger">HIGH RISK DETECTED</span>
                          </div>
                          <p className="text-sm font-medium">9. Limitation of Liability.</p>
                          <p className="text-xs text-muted-foreground mt-1">"In no event shall either party's aggregate liability exceed the sum of $100."</p>
                        </div>

                        <div className="h-4 w-full bg-secondary rounded-md" />
                        <div className="h-4 w-2/3 bg-secondary rounded-md" />
                      </div>
                      {/* Fake Chat Sidebar */}
                      <div className="w-1/3 bg-secondary/10 p-4 flex flex-col">
                        <div className="flex-1 space-y-4">
                          <div className="bg-background border border-border/50 p-3 rounded-xl rounded-tr-none ml-auto w-11/12 shadow-sm">
                            <p className="text-xs">Is the liability cap mutual?</p>
                          </div>
                          <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl rounded-tl-none w-11/12 shadow-sm">
                            <p className="text-xs text-foreground">Yes, Section 9 caps liability mutually at $100. <span className="text-danger font-medium text-[10px] block mt-1">Warning: This cap is unusually low for this transaction size.</span></p>
                          </div>
                        </div>
                        <div className="mt-4 border border-border/50 bg-background rounded-full p-2 px-4 text-xs text-muted-foreground flex justify-between items-center shadow-inner">
                          Ask Juriq anything...
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story / Mission */}
      <section className="bg-foreground py-32 px-4 sm:px-6 lg:px-8 text-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8 flex items-center justify-center gap-4 text-background/50">
            <div className="h-px w-12 bg-background/20" />
            <Scale className="h-6 w-6" />
            <div className="h-px w-12 bg-background/20" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-center mb-12 leading-tight tracking-tight">
            The law shouldn't be a black box.
          </h2>
          <div className="space-y-8 text-lg sm:text-xl md:text-2xl text-background/80 font-serif leading-relaxed text-center">
            <p>
              For decades, legal documents have been guarded by predatory legalese—a language designed not to clarify, but to confuse. It forces founders, freelancers, and everyday people to sign away their rights merely because they can't afford a $600/hour associate.
            </p>
            <p>
              <strong className="text-background font-display tracking-wide uppercase text-sm mb-2 block">Our Mission</strong>
              We built Juriq to weaponize elite artificial intelligence for the underdog. By combining ultra-fast inference with heavily fine-tuned legal models, we are democratizing access to contract clarity, risk detection, and litigation support.
            </p>
            <p className="text-background/60 italic text-lg mt-12">
              Balance the scales. Know what you sign.
            </p>
          </div>
        </motion.div>
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
            className="relative grid gap-8 md:grid-cols-3"
          >
            {/* Connecting Line behind steps (hidden on mobile) */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-border/50 to-transparent hidden md:block w-full z-0" />

            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="relative z-10 text-center group bg-card border border-border/50 p-8 rounded-2xl shadow-xl hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl" />

                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-background border-2 border-primary/20 font-display text-xl font-bold text-primary shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  {s.num}
                </div>
                <h3 className="font-display relative z-10 text-xl font-bold text-foreground mb-3">{s.title}</h3>
                <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
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
          <h2 className="font-display text-3xl font-bold text-foreground">Start using Juriq today</h2>
          <p className="mt-3 text-muted-foreground">
            Create an account to analyze contracts and answer legal questions in seconds.
          </p>
          <div className="mt-8 flex justify-center">
            {user ? (
              <Button variant="hero" size="lg" asChild>
                <Link to="/app">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button variant="hero" size="lg" asChild>
                <Link to="/signup">Create Free Account</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
