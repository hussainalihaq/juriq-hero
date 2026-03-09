import { motion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";

export function ChatAnimation() {
    return (
        <div className="relative w-full h-[300px] overflow-hidden rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm p-4 shadow-xl">
            {/* Fake Header */}
            <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Contract Copilot</span>
            </div>

            <div className="flex flex-col gap-4">
                {/* User Message */}
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="self-end max-w-[80%] rounded-2xl rounded-tr-sm bg-primary p-3 text-sm text-primary-foreground shadow-sm"
                >
                    Can they terminate this NDA without cause?
                </motion.div>

                {/* AI Typing Indicator / Message */}
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                    className="self-start max-w-[90%] rounded-2xl rounded-tl-sm border border-border/50 bg-secondary/50 p-3 shadow-sm"
                >
                    <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <div className="text-sm text-foreground space-y-2">
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 1.8 }}
                            >
                                Yes. Under <strong>Section 4.2</strong>, the Disclosing Party may terminate this agreement at any time by providing 30 days written notice.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.5, delay: 3 }}
                                className="rounded-md border border-warning/20 bg-warning/10 p-2 text-xs text-warning-foreground"
                            >
                                <strong>Risk:</strong> This right is unilateral. You cannot terminate it early.
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Decorative gradient */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        </div>
    );
}
