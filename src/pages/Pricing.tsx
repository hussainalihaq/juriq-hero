import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, GraduationCap } from "lucide-react";
import { mockPricing, mockFAQ } from "@/data/mockData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tiers = [
  { key: "starter" as const, name: "Starter", desc: "For individuals getting started.", cta: "Join Waitlist", popular: false, badge: null },
  { key: "student" as const, name: "Student", desc: "For law students and academic use.", cta: "Join Waitlist", popular: false, badge: "🎓 Edu" },
  { key: "pro" as const, name: "Pro", desc: "Full analysis power for professionals.", cta: "Join Waitlist", popular: true, badge: null },
  { key: "team" as const, name: "Team", desc: "Collaborate with your team.", cta: "Join Waitlist", popular: false, badge: null },
];

const comparisonRows = [
  { feature: "Documents/month", starter: "5", student: "15", pro: "50", team: "200" },
  { feature: "Plain-English explanations", starter: "✓", student: "✓", pro: "✓", team: "✓" },
  { feature: "Risk analysis", starter: "Basic", student: "Full", pro: "Full", team: "Full" },
  { feature: "Edit suggestions", starter: "—", student: "✓", pro: "✓", team: "✓" },
  { feature: "Clause drafting", starter: "—", student: "—", pro: "✓", team: "✓" },
  { feature: "Exports", starter: "1/mo", student: "5/mo", pro: "Unlimited", team: "Unlimited" },
  { feature: "Team seats", starter: "1", student: "1", pro: "1", team: "5" },
  { feature: "Shared workspace", starter: "—", student: "—", pro: "—", team: "✓" },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const data = yearly ? mockPricing.yearly : mockPricing.monthly;

  return (
    <div>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>

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
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-4">
          {tiers.map((tier) => {
            const plan = data[tier.key];
            return (
              <div
                key={tier.key}
                className={`relative rounded-xl border p-6 transition-default ${tier.popular
                    ? "border-primary bg-card shadow-lg shadow-primary/5"
                    : tier.key === "student"
                      ? "border-emerald-500/50 bg-card shadow-md shadow-emerald-500/5"
                      : "border-border/50 bg-card hover:border-border"
                  }`}
              >
                {tier.popular && (
                  <Badge variant="default" className="absolute -top-3 left-6">
                    Most popular
                  </Badge>
                )}
                {tier.badge && (
                  <Badge className="absolute -top-3 left-6 bg-emerald-600 text-white hover:bg-emerald-700">
                    {tier.badge}
                  </Badge>
                )}
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-foreground">{tier.name}</h3>
                  {tier.key === "student" && <GraduationCap className="h-5 w-5 text-emerald-400" />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{tier.desc}</p>
                <div className="mt-6">
                  <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.price !== "Free" && (
                    <span className="text-sm text-muted-foreground">/{yearly ? "mo (billed yearly)" : "month"}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.docs}</p>
                <Button
                  variant={tier.popular ? "hero" : "outline"}
                  className={`mt-6 w-full ${tier.key === "student" ? "border-emerald-500/50 hover:bg-emerald-600 hover:text-white" : ""}`}
                  asChild
                >
                  <Link to="/waitlist">{tier.cta}</Link>
                </Button>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
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
                  <tr key={row.feature} className="border-b border-border/30">
                    <td className="py-3 text-muted-foreground">{row.feature}</td>
                    <td className="py-3 text-center text-muted-foreground">{row.starter}</td>
                    <td className="py-3 text-center text-muted-foreground">{row.student}</td>
                    <td className="py-3 text-center text-foreground">{row.pro}</td>
                    <td className="py-3 text-center text-muted-foreground">{row.team}</td>
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
