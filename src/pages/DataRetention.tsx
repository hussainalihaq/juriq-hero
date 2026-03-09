const sections = [
    { id: "uploaded-documents", title: "1. Uploaded Documents", content: "When you upload a legal document, it is encrypted and stored in your account so you can view it, interact with it via chat, and generate summaries. You can delete any uploaded document at any time from your Dashboard. Once deleted, it is removed from our active databases immediately." },
    { id: "chat-history", title: "2. AI Chat History", content: "The conversational context between you and the Juriq AI regarding your documents is stored to allow you to resume your work. This history is tied to the specific document. When you delete the parent document, the associated chat history is also permanently deleted." },
    { id: "account-data", title: "3. Account Profile Data", content: "Your name, email address, password hash, and workspace settings are retained for as long as your account is active. You may request full account deletion at any time." },
    { id: "deletion-requests", title: "4. How to Request Deletion", content: "You can self-serve document deletion directly within the Juriq app by clicking the 'Trash' icon next to any file. To request a complete deletion of your entire account, all associated documents, and profile data, please email us at privacy@juriq.com. We will process full account deletion requests within 7 business days." },
    { id: "backups", title: "5. System Backups", content: "For disaster recovery purposes, Juriq maintains encrypted database backups. If you delete a document or your account, that data may persist in our secured, isolated backups for up to 30 days before being automatically overwritten and permanently destroyed. Backups are never used for active processing." }
];

export default function DataRetention() {
    return (
        <div className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="font-display text-4xl font-bold text-foreground">Data Retention & Deletion</h1>
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
