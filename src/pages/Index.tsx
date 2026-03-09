import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Minus,
  Plus
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
  { num: "01", title: "Upload & Scan", desc: "Drop your PDF or DOCX to begin secure processing." },
  { num: "02", title: "Instant Analysis", desc: "Juriq reads every line, summarizing terms and flagging risks." },
  { num: "03", title: "Act confidently", desc: "Use AI to redline, ask questions, or draft response emails." },
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
  const [activeStep, setActiveStep] = useState(0);

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



      {/* Scrollytelling Features -> Converted to Inline Animation Blocks */}
      <section className="relative bg-background py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 -mr-64 -mt-64 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -ml-64 -mb-64 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          <div className="mb-24 text-center">
            <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20 px-4 py-1.5 text-sm">
              <Sparkles className="mr-2 h-4 w-4" /> Next-Generation Legal AI
            </Badge>
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl md:text-6xl tracking-tight">
              An elite legal team,<br />
              <span className="text-muted-foreground">living in your browser.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-32">
            {scrollyFeatures.map((feature, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>

                  {/* Text Content */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-20% 0px", once: false }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                    className="w-full lg:w-5/12"
                  >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border bg-primary/20 border-primary text-primary shadow-[0_0_30px_rgba(255,255,255,0.15)] ring-4 ring-primary/10">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="text-xs font-black text-primary mb-3 tracking-[0.2em] uppercase">Step 0{i + 1}</div>
                    <h3 className="font-display text-4xl font-bold text-foreground mb-4">{feature.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>

                  {/* UI Visualizer */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ margin: "-20% 0px", once: false }}
                    transition={{ duration: 0.6 }}
                    className="w-full lg:w-7/12"
                  >
                    <div className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[4/3] rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden">
                      {/* Mac window header */}
                      <div className="flex h-12 w-full items-center gap-2 border-b border-border/40 bg-background/50 px-5 backdrop-blur-md">
                        <div className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                        <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                        <div className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                        <div className="ml-4 flex-1 text-center text-xs text-muted-foreground font-medium flex items-center justify-center gap-2">
                          <Shield className="h-3 w-3" /> juriq-secure-viewer.app
                        </div>
                      </div>

                      {/* UI Mock Area - Dedicated for each step */}
                      <div className="p-6 h-[calc(100%-3rem)] bg-[#09090b] flex flex-col items-center justify-center relative overflow-hidden">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-primary/20 bg-primary/5 blur-3xl opacity-50" />

                        <div className="w-full h-full relative">

                          {/* Render specific animation based on the feature step */}
                          {i === 0 && (
                            <div className="absolute inset-0 w-full h-full border border-white/10 rounded-xl bg-black shadow-2xl overflow-hidden flex flex-col">
                              <div className="h-12 border-b border-white/10 flex items-center px-4 bg-white/5">
                                <div className="h-4 w-32 bg-white/10 rounded-md" />
                              </div>
                              <div className="p-6 space-y-4 relative flex-1">
                                <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-primary/20 to-transparent border-b border-primary z-10" />
                                <div className="h-4 w-full bg-white/5 rounded-md" />
                                <div className="h-4 w-5/6 bg-white/5 rounded-md" />
                                <div className="h-4 w-4/6 bg-white/5 rounded-md" />
                                <div className="mt-8 h-4 w-full bg-white/5 rounded-md" />
                                <div className="h-4 w-5/6 bg-white/5 rounded-md" />

                                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="absolute bottom-6 right-6 left-6 p-4 rounded-xl border border-primary/30 bg-primary/10 backdrop-blur-md shadow-2xl">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-bold text-white">AI Summary Complete</span>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/30 rounded-full" />
                                    <div className="h-2 w-4/5 bg-white/30 rounded-full" />
                                    <div className="h-2 w-3/4 bg-white/30 rounded-full" />
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          )}

                          {i === 1 && (
                            <div className="absolute inset-0 w-full h-full border border-white/10 rounded-xl bg-black shadow-2xl overflow-hidden flex flex-col sm:flex-row">
                              <div className="w-full sm:w-2/3 p-6 space-y-6 border-b sm:border-b-0 sm:border-r border-white/10 relative">
                                <div className="space-y-2 opacity-20 hidden sm:block">
                                  <div className="h-3 w-full bg-white text-white rounded-md" />
                                  <div className="h-3 w-4/5 bg-white text-white rounded-md" />
                                </div>

                                <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="p-4 border border-red-500/30 bg-red-500/10 rounded-lg relative">
                                  <div className="absolute -left-px top-0 bottom-0 w-1 bg-red-500 rounded-l-lg" />
                                  <div className="h-3 w-full bg-red-500/40 rounded-md mb-2" />
                                  <div className="h-3 w-3/4 bg-red-500/40 rounded-md" />
                                </motion.div>

                                <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-lg relative">
                                  <div className="absolute -left-px top-0 bottom-0 w-1 bg-yellow-500 rounded-l-lg" />
                                  <div className="h-3 w-full bg-yellow-500/40 rounded-md mb-2" />
                                  <div className="h-3 w-2/3 bg-yellow-500/40 rounded-md" />
                                </motion.div>
                              </div>
                              <div className="w-full sm:w-1/3 bg-white/[0.02] p-4 flex flex-col gap-3">
                                <div className="text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest hidden sm:block">Risk Radar</div>
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                  <AlertTriangle className="h-4 w-4 text-red-500 mb-2" />
                                  <div className="text-xs text-white font-medium">Undefined Liability Cap</div>
                                </motion.div>
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                  <Shield className="h-4 w-4 text-yellow-500 mb-2" />
                                  <div className="text-xs text-white font-medium">Broad IP Assignment</div>
                                </motion.div>
                              </div>
                            </div>
                          )}

                          {i === 2 && (
                            <div className="absolute inset-0 w-full h-full border border-white/10 rounded-xl bg-black shadow-2xl overflow-hidden flex flex-col">
                              <div className="p-6 flex-1 flex flex-col justify-center">
                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">AI Revision Proposal</div>

                                <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
                                  <div className="p-4 border-b border-white/5 bg-red-500/10 relative">
                                    <div className="absolute top-4 left-4 h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center"><Minus className="h-3 w-3 text-red-500" /></div>
                                    <p className="ml-8 text-sm text-white/60 line-through leading-relaxed">The receiving party agrees to hold all information strictly confidential in perpetuity.</p>
                                  </div>
                                  <div className="p-4 border-b border-white/5 bg-emerald-500/10 relative shadow-inner">
                                    <div className="absolute top-4 left-4 h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center"><Plus className="h-3 w-3 text-emerald-500" /></div>
                                    <p className="ml-8 text-sm text-emerald-400 font-medium leading-relaxed">The receiving party agrees to hold all information strictly confidential for a period of three (3) years.</p>
                                  </div>
                                  <div className="p-3 bg-black flex justify-end gap-2">
                                    <div className="px-4 py-1.5 text-xs text-white/50 border border-white/10 rounded hover:bg-white/5 cursor-pointer">Reject</div>
                                    <div className="px-4 py-1.5 text-xs text-primary-foreground bg-primary/80 rounded border border-primary hover:bg-primary cursor-pointer">Accept</div>
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          )}

                          {i === 3 && (
                            <div className="absolute inset-0 w-full h-full border border-white/10 rounded-xl bg-black shadow-2xl overflow-hidden flex flex-col">
                              <div className="flex-1 p-5 space-y-4 flex flex-col justify-end pb-20 bg-gradient-to-t from-primary/5 to-transparent">
                                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="self-end max-w-[80%] p-3 rounded-2xl rounded-tr-none bg-white/10 border border-white/10 shadow-sm">
                                  <p className="text-sm text-white/90">Does this prevent me from working with competitors?</p>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="self-start max-w-[90%] p-4 rounded-2xl rounded-tl-none bg-primary/20 border border-primary/30 relative shadow-lg">
                                  <Sparkles className="absolute -left-2 -top-2 h-5 w-5 text-primary drop-shadow-md" />
                                  <p className="text-sm text-white/90 leading-relaxed">Yes. Section 4.2 contains a strict non-compete clause that prohibits engagement with any direct competitors for 12 months after termination.</p>
                                  <div className="mt-3 p-2 bg-black/60 rounded-lg border border-white/10 text-xs text-white/50 flex items-center gap-2 w-max">
                                    <FileText className="h-3 w-3" /> Cite: Section 4.2 (Non-Compete)
                                  </div>
                                </motion.div>
                              </div>
                              <div className="absolute bottom-4 left-4 right-4 h-12 rounded-full bg-white/5 border border-white/10 flex items-center px-4 backdrop-blur-md">
                                <span className="text-sm text-white/30">Message Juriq...</span>
                                <div className="ml-auto h-8 w-8 rounded-full bg-primary/30 flex items-center justify-center border border-primary/50">
                                  <ArrowRight className="h-4 w-4 text-primary" />
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* How it works */}
      <section className="border-t border-border/30 bg-secondary/20 py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              How Juriq Works
            </h2>
            <p className="mt-4 text-muted-foreground">Three simple steps to contract clarity.</p>
          </motion.div>
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
              "Private processing — we do not sell your documents or use them to train our core AI.",
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

      {/* Free vs Pro Comparison */}
      <section className="bg-background py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Why upgrade to Pro?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Our free tier is great for quick reviews, but founders and legal professionals need the unthrottled power of Pro.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-border/50 bg-card p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold text-foreground">Free</h3>
                <p className="text-muted-foreground mt-2">Essential AI tools to understand what you sign.</p>
                <div className="mt-4 font-display text-4xl font-bold tracking-tight">$0 <span className="text-lg font-normal text-muted-foreground tracking-normal">/mo</span></div>
              </div>
              <ul className="space-y-4 flex-1 mb-8">
                {[
                  "5 Document Uploads / mo",
                  "Standard Plain-English Summaries",
                  "Basic Risk Detection",
                  "Fair Use Chat Limits",
                  "Community Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-muted-foreground/50 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Student */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold text-foreground">Student</h3>
                <p className="text-muted-foreground mt-2">Discounted pro features for law students.</p>
                <div className="mt-4 font-display text-4xl font-bold tracking-tight">$5 <span className="text-lg font-normal text-muted-foreground tracking-normal">/mo</span></div>
                <div className="mt-2 text-xs text-muted-foreground font-medium flex items-center gap-1">
                  Requires <span className="text-primary bg-primary/10 px-1.5 rounded">.edu</span> email
                </div>
              </div>
              <ul className="space-y-4 flex-1 mb-8">
                {[
                  "50 Document Uploads / mo",
                  "Deep Contextual Analysis",
                  "Advanced Risk Radar",
                  "AI Clause Redlining",
                  "Export to Word / PDF",
                  "Standard Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary/70 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-primary bg-primary/10 p-8 flex flex-col relative shadow-2xl shadow-primary/20 scale-105 z-10">
              <div className="absolute top-0 right-8 -translate-y-1/2">
                <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold text-primary">Pro</h3>
                <p className="text-foreground/80 mt-2">Zero limits. Full legal intelligence at your fingertips.</p>
                <div className="mt-4"><span className="text-sm font-medium text-muted-foreground mr-1">Starting at</span><span className="font-display text-4xl font-bold tracking-tight text-foreground">$29</span> <span className="text-lg font-normal text-muted-foreground tracking-normal">/mo</span></div>
              </div>
              <ul className="space-y-4 flex-1 mb-8">
                {[
                  "Unlimited Document Uploads",
                  "Deep Contextual Analysis",
                  "Advanced Risk & Red-flag Radar",
                  "AI Clause Redlining & Suggestions",
                  "Export to Word / PDF",
                  "Priority Email Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground font-medium">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
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
