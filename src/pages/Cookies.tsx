const sections = [
    { id: "what-are-cookies", title: "1. What are Cookies?", content: "Cookies are small text files placed on your device when you visit our website. They help us remember your preferences, keep you logged in securely, and understand how you use Juriq so we can improve the experience." },
    { id: "essential", title: "2. Essential Cookies", content: "These cookies are strictly necessary for Juriq to function. They handle user authentication (keeping you logged in), session management, and basic security protections. You cannot opt out of these as the service will not work without them." },
    { id: "analytics", title: "3. Analytics & Performance", content: "We may use lightweight analytics cookies to understand how users interact with our site, feature usage, and to identify bugs. This data is aggregated and anonymized." },
    { id: "marketing", title: "4. Marketing Cookies", content: "We currently do not use third-party tracking cookies or marketing pixels to serve targeted off-site advertisements." },
    { id: "managing", title: "5. Managing Your Preferences", content: "You can control or delete cookies through your browser settings. Most browsers allow you to block all cookies or notify you when one is set. However, blocking essential cookies will prevent you from logging into your Juriq dashboard." }
];

export default function Cookies() {
    return (
        <div className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="font-display text-4xl font-bold text-foreground">Cookie Policy</h1>
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
