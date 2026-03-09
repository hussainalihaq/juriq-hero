const sections = [
    { id: "subscriptions", title: "1. Subscription Terms", content: "Juriq offers paid subscription plans billed either monthly or annually. By subscribing, you agree to an initial and recurring subscription fee at the then-current active rate. You accept responsibility for all recurring charges until you cancel your subscription." },
    { id: "cancellations", title: "2. Cancellations", content: "You can easily cancel your subscription at any time by navigating to Settings > Billing within your Juriq dashboard. Cancellations take effect at the end of your current paid billing period. You will retain access to premium features until that cycle ends." },
    { id: "refunds", title: "3. Refund Policy (14-Day Guarantee)", content: "We offer a 14-day money-back guarantee for initial purchases of our paid plans. If you are unsatisfied for any reason within the first 14 days of your initial subscription, contact support@juriq.com for a full refund. Beyond the first 14 days, fees are non-refundable." },
    { id: "renewals", title: "4. Auto-Renewals", content: "Unless you cancel before the end of your billing cycle, your subscription will automatically renew. We will send a reminder email prior to the renewal date for annual subscriptions." },
    { id: "changes", title: "5. Price Changes", content: "We reserve the right to modify our pricing at any time. We will always notify active subscribers of any pricing changes well in advance, and changes will only apply to future billing cycles." }
];

export default function Refunds() {
    return (
        <div className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="font-display text-4xl font-bold text-foreground">Billing & Refund Policy</h1>
                <p className="mt-3 text-sm text-muted-foreground">Last updated: March 10, 2026</p>

                {/* TOC */}
                <nav className="mt-8 rounded-xl border border-border/50 bg-card p-5">
                    <h3 className="mb-3 font-display text-sm font-semibold text-foreground">Contents</h3>
                    <ul className="space-y-1.5">
                        {sections.map((s) => (
                            <li key={s.id}>
                                <a href={`#${s.id}`} className="text-sm text-link hover:text-foreground transition-default">{s.title}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-10 space-y-10">
                    {sections.map((s) => (
                        <section key={s.id} id={s.id}>
                            <h2 className="font-display text-lg font-bold text-foreground">{s.title}</h2>
                            <p className="mt-3 leading-relaxed text-muted-foreground text-sm">{s.content}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
