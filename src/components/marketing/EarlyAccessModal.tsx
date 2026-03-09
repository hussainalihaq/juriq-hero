import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface EarlyAccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EarlyAccessModal({ isOpen, onClose }: EarlyAccessModalProps) {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setSubmitting(true);
        try {
            if (!import.meta.env.VITE_SUPABASE_URL) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                toast.success("You're on the list! We'll be in touch soon.");
                setEmail("");
                onClose();
                return;
            }

            const { error } = await supabase.from("waitlist").insert([{ email }]);
            if (error) {
                if (error.code === '23505') { // unique violation
                    toast.success("You're already on the list!");
                    setEmail("");
                    onClose();
                    return;
                }
                throw error;
            }

            toast.success("You're on the list! We'll be in touch soon.");
            setEmail("");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-card border border-border/50 text-foreground overflow-hidden">
                {/* Glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />

                <DialogHeader className="relative z-10">
                    <DialogTitle className="font-display font-bold text-2xl mb-2 tracking-tight">
                        Join the Waitlist
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Juriq is currently in private beta. Enter your email to get early access when we launch.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10 mt-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus-accent transition-default"
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="default"
                        className="w-full py-6 text-sm font-semibold shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Request Access <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
