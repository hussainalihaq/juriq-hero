const sections = [
    { id: "infrastructure", title: "Hosting & Infrastructure", content: "Vercel / AWS (US East) - Used for primary application hosting and database infrastructure. Processes account data and document metadata." },
    { id: "ai", title: "AI & Model Providers", content: "Google (Gemini) - Used to provide the core AI analysis, summaries, and chat features. Documents are sent via API for processing. Per our provider agreements, your data is NOT used to train their models." },
    { id: "database", title: "Authentication & Database", content: "Supabase - Used for user authentication, session management, and underlying database storage. Stores account data and encrypted document text." },
    { id: "payments", title: "Billing & Subscriptions", content: "Paddle - Used as the Merchant of Record for processing payments and managing subscriptions. Processes billing information and email addresses." },
    { id: "support", title: "Customer Support (Optional)", content: "Tidio / Crisp - Used for the live chat widget on the marketing site to assist with sales and support inquiries. Only processes data if you interact with the widget." }
];

export default function Subprocessors() {
    return (
        <div className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="font-display text-4xl font-bold text-foreground">Subprocessors</h1>
                <p className="mt-3 text-sm text-muted-foreground">Last updated: March 10, 2026</p>

                <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                    To provide the Juriq service, we engage third-party service providers ("subprocessors") who may process, store, or otherwise handle user data. We evaluate all subprocessors for their security posture and data processing agreements.
                </p>

                <div className="mt-10 space-y-10">
                    {sections.map((s) => (
                        <section key={s.id} id={s.id} className="rounded-xl border border-border/50 bg-card p-6">
                            <h2 className="font-display text-lg font-bold text-foreground">{s.title}</h2>
                            <p className="mt-3 leading-relaxed text-muted-foreground text-sm">{s.content}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
