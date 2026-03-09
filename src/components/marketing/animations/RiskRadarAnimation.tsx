import { motion } from "framer-motion";
import { AlertTriangle, FileText } from "lucide-react";

export function RiskRadarAnimation() {
    return (
        <div className="relative w-full h-[300px] overflow-hidden rounded-xl border border-border/50 bg-card p-4 shadow-xl">
            {/* Document Skeleton */}
            <div className="space-y-4 opacity-70">
                <div className="h-4 w-1/3 rounded-lg bg-muted" />
                <div className="space-y-2">
                    <div className="h-2 w-full rounded bg-muted/50" />
                    <div className="h-2 w-5/6 rounded bg-muted/50" />
                    <div className="h-2 w-full rounded bg-muted/50" />
                </div>

                {/* The Risky Clause */}
                <div className="relative p-2 rounded-lg transition-colors duration-500 mt-6 h-16 w-full">
                    {/* Scanning Line */}
                    <motion.div
                        initial={{ top: -50, opacity: 0 }}
                        animate={{ top: 150, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                        className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_2px_rgba(59,130,246,0.5)] z-10"
                    />

                    <motion.div
                        initial={{ backgroundColor: "transparent" }}
                        animate={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                        transition={{ duration: 0.5, delay: 2.2, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
                        className="absolute inset-0 rounded-md border border-danger/20"
                    />
                    <div className="space-y-2 relative z-0 pl-2 mt-1">
                        <div className="h-2 w-full rounded bg-muted/80" />
                        <div className="h-2 w-4/5 rounded bg-muted/80" />
                    </div>

                    {/* Risk Badge Pop */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5], y: [10, 0, 0, 10] }}
                        transition={{ duration: 4, delay: 2.2, repeat: Infinity, repeatDelay: 0 }}
                        className="absolute -right-2 -top-3 flex items-center gap-1.5 rounded-full shadow-lg bg-danger px-2.5 py-1 text-xs font-bold text-white z-20"
                    >
                        <AlertTriangle className="h-3 w-3" />
                        High Risk
                    </motion.div>
                </div>

                <div className="space-y-2 mt-6">
                    <div className="h-2 w-full rounded bg-muted/50" />
                    <div className="h-2 w-3/4 rounded bg-muted/50" />
                </div>
            </div>

            {/* Decorative gradient */}
            <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-danger/5 blur-3xl" />
        </div>
    );
}
