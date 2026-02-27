const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms", content: "By accessing or using Juriq, you agree to be bound by these Terms of Service. If you do not agree, do not use the service. We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the revised terms." },
  { id: "description", title: "2. Description of Service", content: "Juriq provides AI-powered contract analysis tools including document summarization, risk identification, and edit suggestions. The service is provided as-is and is intended as an informational aid, not as legal advice. Users should consult qualified legal professionals for binding legal decisions." },
  { id: "accounts", title: "3. User Accounts", content: "You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must be at least 18 years old to use this service. We reserve the right to suspend or terminate accounts that violate these terms." },
  { id: "content", title: "4. User Content", content: "You retain ownership of all documents and content you upload to Juriq. By uploading content, you grant us a limited license to process your documents for the purpose of providing the service. We do not use your content for training models or share it with third parties." },
  { id: "limitations", title: "5. Limitations of Liability", content: "Juriq is provided on an 'as-is' and 'as-available' basis. We make no warranties regarding the accuracy, completeness, or reliability of the analysis provided. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages." },
  { id: "termination", title: "6. Termination", content: "Either party may terminate this agreement at any time. Upon termination, your right to use the service ceases immediately. We may retain your data for a reasonable period to comply with legal obligations. You may request deletion of your data by contacting support." },
  { id: "governing", title: "7. Governing Law", content: "These terms shall be governed by and construed in accordance with applicable law. Any disputes arising from these terms shall be resolved through binding arbitration, except where prohibited by law." },
  { id: "contact", title: "8. Contact", content: "For questions about these Terms of Service, please contact us at legal@juriq.com." },
];

export default function Terms() {
  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-foreground">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: January 1, 2025</p>

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
