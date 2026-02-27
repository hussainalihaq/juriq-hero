import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockInvoices } from "@/data/mockData";
import { CreditCard, ExternalLink } from "lucide-react";

export default function Billing() {
  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-foreground mb-8">Billing</h1>

        {/* Current plan */}
        <section className="mb-8 rounded-xl border border-border/50 bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display text-lg font-semibold text-foreground">Current Plan</h2>
            </div>
            <Badge variant="default">Pro</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly price</span>
              <span className="text-foreground font-medium">$29.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Documents used</span>
              <span className="text-foreground font-medium">12 / 50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next billing date</span>
              <span className="text-foreground font-medium">Feb 1, 2025</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/pricing">
                Upgrade Plan
                <ExternalLink className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Invoices */}
        <section className="rounded-xl border border-border/50 bg-card">
          <div className="border-b border-border/50 px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Invoices</h2>
          </div>
          <div className="divide-y divide-border/30">
            {mockInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{inv.id}</p>
                  <p className="text-xs text-muted-foreground">{inv.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground">{inv.amount}</span>
                  <Badge variant="low" className="text-[10px]">{inv.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
