import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Quote } from "lucide-react";

const bullets = [
  "AI-powered contract analysis in plain English",
  "Risk flagging with severity levels",
  "Edit suggestions with before/after diffs",
  "Export summaries as PDF, edits as DOCX",
  "Free tier available at launch",
];

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  return (
    <div className="flex min-h-[80vh] items-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            Get early access to Juriq
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Be among the first to review contracts with AI. No credit card required.
          </p>
          <ul className="mt-8 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-xl border border-border/50 bg-card p-5">
            <Quote className="mb-2 h-4 w-4 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              "I signed up for the waitlist after a friend showed me the risk analysis. Can't wait to use it on my next vendor contract."
            </p>
            <p className="mt-3 text-xs font-semibold text-foreground">
              Taylor R. <span className="font-normal text-muted-foreground">· Operations Manager</span>
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-xl border border-border/50 bg-card p-8">
            <h2 className="font-display text-xl font-bold text-foreground">Join the waitlist</h2>
            <p className="mt-2 text-sm text-muted-foreground">We'll notify you when access opens up.</p>
            <div className="mt-6 space-y-4">
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-accent"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus-accent"
              >
                <option value="">Select your role (optional)</option>
                <option value="founder">Founder / CEO</option>
                <option value="legal">Legal Professional</option>
                <option value="student">Student</option>
                <option value="freelancer">Freelancer</option>
                <option value="other">Other</option>
              </select>
              <Button variant="hero" size="lg" className="w-full" onClick={() => {}}>
                Join Waitlist
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              No spam. We'll only email you about access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
