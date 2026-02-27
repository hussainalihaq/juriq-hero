const sections = [
  { id: "collection", title: "1. Information We Collect", content: "We collect information you provide directly, including your name, email address, and documents you upload for analysis. We also collect usage data such as pages visited, features used, and interaction patterns to improve the service." },
  { id: "usage", title: "2. How We Use Your Information", content: "We use your information to provide and improve the Juriq service, process your documents for analysis, communicate with you about your account, and send service-related notifications. We do not use your uploaded documents to train AI models." },
  { id: "sharing", title: "3. Information Sharing", content: "We do not sell your personal information. We may share information with service providers who assist in operating our platform, but only to the extent necessary. We may disclose information if required by law or to protect our rights." },
  { id: "storage", title: "4. Data Storage & Security", content: "Your data is stored on secure servers with encryption in transit. We implement reasonable security measures to protect your information. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security." },
  { id: "retention", title: "5. Data Retention", content: "We retain your account data for as long as your account is active. Uploaded documents and analysis results are retained until you delete them or close your account. You may request deletion of your data at any time by contacting support@juriq.com." },
  { id: "rights", title: "6. Your Rights", content: "You have the right to access, correct, or delete your personal information. You may export your data or request a copy. You may also opt out of non-essential communications. To exercise these rights, contact privacy@juriq.com." },
  { id: "cookies", title: "7. Cookies", content: "We use essential cookies to maintain your session and preferences. We do not use tracking cookies for advertising purposes. You may disable cookies in your browser settings, but this may affect service functionality." },
  { id: "changes", title: "8. Changes to This Policy", content: "We may update this privacy policy from time to time. We will notify you of significant changes via email or in-app notification. Continued use of the service after changes constitutes acceptance." },
  { id: "contact", title: "9. Contact", content: "For privacy-related questions or requests, contact us at privacy@juriq.com." },
];

export default function Privacy() {
  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: January 1, 2025</p>

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
