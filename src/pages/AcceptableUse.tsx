const sections = [
    { id: "illegal", title: "1. Illegal and Harmful Use", content: "You may not use Juriq for any illegal, fraudulent, or malicious activities. This includes but is not limited to generating documents for illegal schemes, facilitating harassment, or violating the rights of others." },
    { id: "authorization", title: "2. Authorized Content", content: "You must only upload documents that you are authorized to share and analyze. Do not upload classified government documents, stolen intellectual property, or confidential material belonging to third parties without their explicit consent." },
    { id: "misuse", title: "3. Misuse of Outputs", content: "You may not misrepresent Juriq's AI-generated outputs as guaranteed legal advice or final legal analysis. If providing documents to third parties, you must disclose that they were reviewed or generated with AI assistance." },
    { id: "security", title: "4. System Integrity and Security", content: "You agree not to attempt to bypass Juriq's security measures, reverse-engineer our AI models, scrape data, upload malware, or intentionally overload our infrastructure. Automated access without an official API key is prohibited." },
    { id: "enforcement", title: "5. Enforcement", content: "We reserve the right to suspend or permanently terminate accounts that violate this Acceptable Use Policy, without prior notice. We may also report severe violations to appropriate law enforcement authorities." }
];

export default function AcceptableUse() {
    return (
        <div className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="font-display text-4xl font-bold text-foreground">Acceptable Use Policy</h1>
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
