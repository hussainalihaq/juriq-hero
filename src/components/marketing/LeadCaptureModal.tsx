import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { EarlyAccessModal } from "@/components/marketing/EarlyAccessModal";

export function LeadCaptureModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [showWaitlist, setShowWaitlist] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        // If the user is already logged in, never show the conversion popup.
        if (user) return;

        // Check if the user has already seen and dismissed the modal in this session
        const hasSeenModal = sessionStorage.getItem("juriq-lead-modal-seen-v2");
        if (hasSeenModal) return;

        let timeoutId: NodeJS.Timeout;

        const handleMouseOut = (e: MouseEvent) => {
            // Trigger intent-to-leave (mouse leaves the top of the viewport)
            // Increased to 50px to make it trigger more reliably before the mouse fully leaves
            if (e.clientY <= 50) {
                setIsOpen(true);
                sessionStorage.setItem("juriq-lead-modal-seen-v2", "true");
                document.removeEventListener("mouseout", handleMouseOut);
                clearTimeout(timeoutId);
            }
        };

        // Backup trigger: If they stay on the page for 45 seconds, pop it up anyway
        timeoutId = setTimeout(() => {
            setIsOpen(true);
            sessionStorage.setItem("juriq-lead-modal-seen-v2", "true");
            document.removeEventListener("mouseout", handleMouseOut);
        }, 45000);

        // Only attach exit intent on desktop
        if (window.innerWidth > 768) {
            document.addEventListener("mouseout", handleMouseOut);
        }

        return () => {
            document.removeEventListener("mouseout", handleMouseOut);
            clearTimeout(timeoutId);
        };
    }, [user]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-4 top-4 z-10 rounded-full bg-black/10 p-2 text-muted-foreground backdrop-blur-md transition-colors hover:bg-black/20 hover:text-foreground dark:bg-white/10 dark:hover:bg-white/20"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* Banner Graphic Area */}
                    <div className="relative h-32 w-full bg-gradient-to-br from-primary/80 to-primary p-6 overflow-hidden">

                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
                        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

                        <div className="relative z-10 flex h-full items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-md">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-display text-xl font-bold text-white">Wait, before you go...</h3>
                                <p className="text-sm text-white/90">Stop reading legalese manually.</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-foreground">Special Offer</span>
                        </div>

                        <h4 className="text-2xl font-bold leading-tight text-foreground mb-3">
                            Join the Private Beta Waitlist
                        </h4>

                        <p className="text-muted-foreground mb-6">
                            Juriq is currently in private beta. Skip the line and get early access to our AI Legal Copilot before the public launch. Let us help you find hidden risks, summarize dense clauses, and track obligations in seconds.
                        </p>

                        <ul className="mb-8 space-y-3">
                            {[
                                "No credit card required.",
                                "Plain-English summaries in seconds.",
                                "Red-flag detection for liability traps."
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                                    <div className="mt-0.5 rounded-full bg-success/20 p-1 text-success">
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    {benefit}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button variant="hero" className="w-full sm:w-auto" onClick={() => {
                                setIsOpen(false);
                                setShowWaitlist(true);
                            }}>
                                Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setIsOpen(false)}>
                                Maybe later
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <EarlyAccessModal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} />
        </AnimatePresence>
    );
}
