import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield, Zap, Sparkles, Building2, FileText } from "lucide-react";

export default function Upgrade() {
    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row overflow-hidden bg-background">
            {/* Left side - Value Prop */}
            <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center overflow-y-auto">
                <Badge variant="outline" className="w-fit mb-6 border-primary/20 bg-primary/10 text-primary px-3 py-1">
                    <Sparkles className="h-3.5 w-3.5 mr-2" />
                    Unlock the Full Power of Juriq
                </Badge>

                <h1 className="font-display text-4xl font-bold text-foreground mb-4">
                    Upgrade to Pro
                </h1>
                <p className="text-lg text-muted-foreground mb-8 line-clamp-3">
                    Stop getting blocked by "High Risk" paywalls. Get full access to AI redlines, total risk visibility, and unlimited document analysis.
                </p>

                <div className="space-y-6 flex-1">
                    {[
                        {
                            title: "Unlimited Document Analysis",
                            desc: "Upload and analyze as many contracts, NDAs, and agreements as you need without hitting monthly caps.",
                            icon: FileText,
                        },
                        {
                            title: "Full Risk & Red-flag Visibility",
                            desc: "See exactly which clauses are hidden traps. No more blurred lines or hidden alerts.",
                            icon: Shield,
                        },
                        {
                            title: "AI Redlines & Clause Drafting",
                            desc: "Command Juriq to automatically rewrite predatory clauses to be highly protective of your interests.",
                            icon: Zap,
                        },
                    ].map((feature, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side - Checkout Config (Polar.sh target) */}
            <div className="w-full lg:w-1/2 bg-secondary/30 p-8 lg:p-16 flex items-center justify-center overflow-y-auto border-l border-border/50">
                <div className="w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
                    <div className="p-8 border-b border-border/50 text-center">
                        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Pro Plan</h2>
                        <div className="flex items-end justify-center gap-1 mb-2">
                            <span className="text-4xl font-bold font-display text-foreground">$29</span>
                            <span className="text-sm text-muted-foreground mb-1">/mo</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Billed monthly. Cancel anytime.</p>
                    </div>

                    <div className="p-8 space-y-6">
                        <ul className="space-y-3">
                            {[
                                "Everything in Free",
                                "Unlimited plain-English summaries",
                                "Export full risk reports (PDF)",
                                "Priority AI inference speed",
                                "Clause extraction \u0026 redlines",
                                "Ask up to 500 questions/mo"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-4">
                            {/* This button will trigger backend checkout logic */}
                            <Button size="lg" className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold" onClick={() => alert('Checkout Initiation (Backend required)')}>
                                Subscribe
                            </Button>
                            <p className="text-center text-[10px] text-muted-foreground mt-4 flex items-center justify-center gap-1">
                                <Shield className="h-3 w-3" /> Secure payment processing
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
