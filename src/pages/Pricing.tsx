import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, GraduationCap } from "lucide-react";
import { mockPricing, mockFAQ } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tiers = [
  { key: "starter" as const, name: "Starter", desc: "Contract-first basics + limited research help.", cta: "Sign Up", popular: false, badge: null },
  { key: "student" as const, name: "Student", desc: "Contract review + case law research for students.", cta: "Sign Up", popular: false, badge: "🎓 Edu" },
  { key: "pro" as const, name: "Pro", desc: "Higher limits + better drafting + exports.", cta: "Sign Up", popular: true, badge: null },
  { key: "team" as const, name: "Team", desc: "Shared workspace + higher limits for teams.", cta: "Sign Up", popular: false, badge: null },
];

const comparisonRows = [
  { feature: "Documents/month", starter: "5", student: "15", pro: "50", team: "200" },
  { feature: "Plain-English summaries", starter: "✓", student: "✓", pro: "✓", team: "✓" },
  { feature: "Ask legal questions (Chat)", starter: "Basic", student: "✓", pro: "✓", team: "✓" },
  { feature: "Clause extraction", starter: "✓", student: "✓", pro: "✓", team: "✓" },
  { feature: "Risk & red-flag detection", starter: "Basic", student: "Full", pro: "Full", team: "Full" },
  { feature: "Obligations & deadlines", starter: "—", student: "✓", pro: "✓", team: "✓" },
  { feature: "Rewrite / improve clauses", starter: "—", student: "✓", pro: "✓", team: "✓" },
  { feature: "Exports", starter: "1/mo", student: "5/mo", pro: "Unlimited", team: "Unlimited" },
  { feature: "Team workspace", starter: "—", student: "—", pro: "—", team: "✓" },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const { user } = useAuth();
  const data = yearly ? mockPricing.yearly : mockPricing.monthly;

  return (
    <div>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">transparent</span> pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-6 text-lg text-muted-foreground"
          >
            Start free. Upgrade when you need more.
          </motion.p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-default ${!yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-default ${yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Yearly
              <Badge variant="low" className="ml-2 text-[10px]">Save 17%</Badge>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:gap-8 lg:grid-cols-4 items-center mt-8">
          {tiers.map((tier, index) => {
            const plan = data[tier.key];
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                key={tier.key}
                className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full bg-background/40 backdrop-blur-sm ${tier.popular
                  ? "border-primary/50 bg-gradient-to-b from-primary/10 to-transparent shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-primary/20 md:scale-105 z-10"
                  : tier.key === "student"
                    ? "border-emerald-500/30 bg-gradient-to-b from-emerald-500/5 to-transparent hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    : "border-border/50 hover:border-border hover:shadow-xl hover:shadow-primary/5"
                  }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-max rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 text-xs font-bold tracking-wide uppercase text-primary-foreground shadow-sm">
                    Most Popular
                  </div>
                )}
                {tier.badge && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-max rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold tracking-wide uppercase text-white shadow-sm">
                    {tier.badge}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <h3 className="font-display text-xl font-bold text-foreground">{tier.name}</h3>
                  {tier.key === "student" && <GraduationCap className="h-5 w-5 text-emerald-400" />}
                </div>
                <p className="mt-3 text-sm text-muted-foreground min-h-[40px] leading-relaxed">{tier.desc}</p>
                <div className="mt-8">
                  <span className="font-display text-5xl font-bold tracking-tight text-foreground">{plan.price}</span>
                  {plan.price !== "Free" && (
                    <span className="text-sm font-medium text-muted-foreground ml-1">/{yearly ? "mo (yearly)" : "month"}</span>
                  )}
                </div>
                <p className="mt-3 text-sm font-medium text-muted-foreground">{plan.docs}</p>
                <Button
                  variant={tier.popular ? "hero" : "outline"}
                  size="lg"
                  className={`mt-8 w-full transition-transform active:scale-95 ${tier.key === "student" ? "border-emerald-500/50 text-emerald-500 hover:bg-emerald-500 hover:text-white" : ""}`}
                  asChild
                >
                  <Link to={user ? "/app/billing" : "/signup"}>{user ? "Subscribe" : tier.cta}</Link>
                </Button>
                <ul className="mt-8 space-y-4 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                      <div className={`mt-0.5 rounded-full p-0.5 ${tier.popular ? "bg-primary/20 text-primary" : tier.key === "student" ? "bg-emerald-500/20 text-emerald-500" : "bg-success/20 text-success"}`}>
                        <Check className="h-3 w-3 flex-shrink-0" strokeWidth={3} />
                      </div>
                      <span className="leading-relaxed text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-t border-border/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground">Compare plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left font-medium text-muted-foreground">Feature</th>
                  <th className="py-3 text-center font-medium text-muted-foreground">Starter</th>
                  <th className="py-3 text-center font-medium text-emerald-400">Student</th>
                  <th className="py-3 text-center font-medium text-foreground">Pro</th>
                  <th className="py-3 text-center font-medium text-muted-foreground">Team</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b border-border/30 hover:bg-muted/20 transition-colors group">
                    <td className="py-4 px-2 text-muted-foreground group-hover:text-foreground transition-colors">{row.feature}</td>
                    <td className="py-4 text-center text-muted-foreground">{row.starter}</td>
                    <td className="py-4 text-center text-muted-foreground group-hover:text-emerald-400 transition-colors">{row.student}</td>
                    <td className="py-4 text-center text-foreground font-medium">{row.pro}</td>
                    <td className="py-4 text-center text-muted-foreground">{row.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {mockFAQ.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border border-border/50 bg-card px-4">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
