import { Shield, Lock, Trash2, Eye, Server, Database, Key } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  {
    icon: Eye,
    title: "What we store",
    desc: "When you upload a document, we store the file temporarily to perform analysis. Extracted text and analysis results are stored in your account until you delete them.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/50",
    shadow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
  },
  {
    icon: Lock,
    title: "Encryption in transit",
    desc: "All file uploads and API communication use TLS encryption. We are working toward additional at-rest encryption and will update this page as we make progress.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/50",
    shadow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
  },
  {
    icon: Trash2,
    title: "Data deletion",
    desc: "You can delete any document from your account at any time. For full account data deletion, email support@juriq.com and we will process your request within 7 business days.",
    color: "text-danger",
    bg: "bg-danger/10",
    border: "group-hover:border-danger/50",
    shadow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]",
  },
  {
    icon: Shield,
    title: "No data sharing",
    desc: "Your legal documents are never shared with third parties or used to train models. Your legal data is yours alone.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "group-hover:border-purple-500/50",
    shadow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
  },
];

export default function Security() {
  return (
    <div className="relative min-h-screen px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground">
            Enterprise-grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">security</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            We take a straightforward approach to security. Your legal documents are sensitive, and we treat them that way.
          </p>
        </motion.div>

        {/* Animated Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 mb-20 relative p-8 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-md shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-2xl mx-auto">
            {/* Client */}
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center shadow-lg z-10">
                <Lock className="h-6 w-6 text-emerald-500" />
              </div>
              <span className="text-sm font-medium text-foreground">Your Browser</span>
            </div>

            {/* Connecting Line (Animated) */}
            <div className="flex-1 h-0.5 w-full md:w-auto flex items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-border/50" />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
              />
              <span className="absolute left-1/2 -translate-x-1/2 -top-6 text-[10px] font-bold tracking-widest text-primary uppercase bg-background px-2">TLS 1.2+</span>
            </div>

            {/* Server */}
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-card border border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center justify-center z-10">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Juriq Core</span>
            </div>

            {/* Connecting Line (Animated) */}
            <div className="flex-1 h-0.5 w-full md:w-auto flex items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-border/50" />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
              />
              <span className="absolute left-1/2 -translate-x-1/2 -top-6 text-[10px] font-bold tracking-widest text-purple-500 uppercase bg-background px-2">AES-256</span>
            </div>

            {/* Database */}
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center shadow-lg z-10 relative overflow-hidden">
                <Database className="h-6 w-6 text-muted-foreground relative z-10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-10 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(168,85,247,0.3)_360deg)]"
                />
              </div>
              <span className="text-sm font-medium text-foreground">Cold Storage</span>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
              key={i}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-8 transition-all duration-300 ${item.border} ${item.shadow}`}
            >
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-${item.color.split('-')[1]}-500/5 to-transparent`} />
              <div className="relative z-10">
                <div className={`mb-6 inline-flex rounded-xl ${item.bg} p-3 transition-transform duration-300 group-hover:scale-110`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 flex items-center justify-center gap-3 rounded-2xl border border-warning/20 bg-warning/5 p-6 text-center"
        >
          <Key className="h-5 w-5 text-warning shrink-0" />
          <p className="text-sm text-warning-foreground font-medium">
            We are an early-stage product and do not currently hold SOC2 or ISO 27001 certifications. We're building security practices incrementally.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
