import { motion } from "framer-motion";
import { Search, Scale } from "lucide-react";

export function ResearchAnimation() {
    const fullText = "California non-compete enforceability examples";

    return (
        <div className="relative w-full h-[300px] overflow-hidden rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 shadow-xl flex flex-col items-center justify-center">

            {/* Search Bar */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -30, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                className="w-full max-w-[90%] relative"
            >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="w-full bg-card border border-primary/30 rounded-full py-2.5 pl-10 pr-4 text-sm text-foreground shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1.5 }}
                    >
                        {fullText}
                    </motion.span>
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        className="ml-0.5 inline-block w-1.5 h-4 bg-primary align-middle"
                    />
                </div>
            </motion.div>

            {/* Result Card */}
            <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: -10, opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 3.5, ease: "easeOut" }}
                className="w-full max-w-[90%] bg-card border border-border/50 rounded-xl p-4 shadow-lg text-left"
            >
                <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                        <Scale className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">Edwards v. Arthur Andersen LLP (2008)</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            The California Supreme Court held that non-compete agreements are generally void under Business and Professions Code section 16600, rejecting the "narrow-restraint" exception...
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Decorative gradient */}
            <div className="pointer-events-none absolute inset-0 z-[-1] flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="h-48 w-48 rounded-full bg-primary/20 blur-[50px]"
                />
            </div>
        </div>
    );
}
