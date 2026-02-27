export const mockChatMessages = [
  {
    id: "1",
    role: "user" as const,
    content: "Can you summarize this NDA and flag any risks?",
    timestamp: "2:34 PM",
  },
  {
    id: "2",
    role: "assistant" as const,
    content: "",
    timestamp: "2:35 PM",
    summary: "This is a Mutual Non-Disclosure Agreement between Acme Corp and Beta Inc, effective January 15, 2025. It covers confidential business information, trade secrets, and proprietary data shared during a potential partnership evaluation.",
    risks: [
      { severity: "high" as const, title: "Unlimited liability clause", description: "Section 7.2 imposes uncapped liability for any breach, including indirect damages." },
      { severity: "high" as const, title: "Non-compete buried in NDA", description: "Section 9.1 contains a 24-month non-compete that extends beyond standard NDA scope." },
      { severity: "medium" as const, title: "Broad definition of confidential info", description: "Section 2 defines confidential information very broadly, potentially covering public information." },
      { severity: "low" as const, title: "Standard jurisdiction clause", description: "Jurisdiction is set to Delaware courts, which is standard for US agreements." },
    ],
    editSuggestions: [
      { original: "Party shall be liable for all damages, including indirect, consequential, and punitive damages.", suggested: "Party shall be liable for direct damages only, capped at the value of the transaction." },
      { original: "Receiving Party shall not engage in any business that competes with Disclosing Party for 24 months.", suggested: "Remove non-compete clause or limit to 6 months within the specific business area discussed." },
    ],
    clauses: [
      { label: "Confidentiality", excerpt: "All information shared between parties shall be treated as confidential...", section: "§2.1" },
      { label: "Liability", excerpt: "Party shall be liable for all damages, including indirect...", section: "§7.2" },
      { label: "Non-Compete", excerpt: "Receiving Party shall not engage in any business that competes...", section: "§9.1" },
      { label: "Termination", excerpt: "Either party may terminate this agreement with 30 days written notice...", section: "§11" },
    ],
  },
];

export const mockDocuments = [
  { id: "1", name: "Acme-NDA-2025.pdf", type: "PDF", uploaded: "Jan 15, 2025", status: "Analyzed", pages: 12 },
  { id: "2", name: "Beta-ServiceAgreement.docx", type: "DOCX", uploaded: "Jan 12, 2025", status: "Analyzed", pages: 24 },
  { id: "3", name: "Freelancer-Contract-v2.pdf", type: "PDF", uploaded: "Jan 10, 2025", status: "Pending", pages: 8 },
  { id: "4", name: "IP-Assignment-Draft.docx", type: "DOCX", uploaded: "Jan 8, 2025", status: "Analyzed", pages: 6 },
  { id: "5", name: "Lease-Agreement-Office.pdf", type: "PDF", uploaded: "Jan 5, 2025", status: "Analyzed", pages: 18 },
];

export const mockDocumentDetail = {
  id: "1",
  name: "Acme-NDA-2025.pdf",
  type: "PDF",
  uploaded: "Jan 15, 2025",
  status: "Analyzed",
  pages: 12,
  parties: ["Acme Corp", "Beta Inc"],
  effectiveDate: "January 15, 2025",
  expirationDate: "January 15, 2027",
  governingLaw: "State of Delaware",
  keyAmounts: ["$500,000 liability cap (suggested)", "N/A"],
  riskSummary: { high: 2, medium: 1, low: 1 },
};

export const mockEditSuggestions = [
  {
    id: "1",
    clause: "Liability",
    section: "§7.2",
    severity: "high" as const,
    original: "Party shall be liable for all damages, including indirect, consequential, and punitive damages, arising from any breach of this Agreement, without limitation.",
    suggested: "Party shall be liable for direct damages only. Total aggregate liability under this Agreement shall not exceed the greater of (a) $500,000 or (b) the total fees paid under the related transaction agreement.",
    status: "pending" as const,
  },
  {
    id: "2",
    clause: "Non-Compete",
    section: "§9.1",
    severity: "high" as const,
    original: "Receiving Party shall not, directly or indirectly, engage in any business that competes with the Disclosing Party's business for a period of twenty-four (24) months following termination of this Agreement.",
    suggested: "This clause should be removed from the NDA entirely, as non-compete provisions are outside the standard scope of a non-disclosure agreement. If retained, limit to 6 months and narrowly define the competitive scope.",
    status: "pending" as const,
  },
  {
    id: "3",
    clause: "Confidential Information",
    section: "§2.1",
    severity: "medium" as const,
    original: "\"Confidential Information\" means any and all information, whether written, oral, electronic, or visual, disclosed by either Party to the other Party, without limitation.",
    suggested: "\"Confidential Information\" means information that is (a) marked as confidential at the time of disclosure, or (b) if disclosed orally, identified as confidential within 10 business days. Excludes information that is publicly available or independently developed.",
    status: "pending" as const,
  },
  {
    id: "4",
    clause: "Jurisdiction",
    section: "§12.3",
    severity: "low" as const,
    original: "This Agreement shall be governed by the laws of the State of Delaware, and any disputes shall be resolved in the courts of New Castle County, Delaware.",
    suggested: "No changes recommended. Delaware jurisdiction is standard for US commercial agreements.",
    status: "accepted" as const,
  },
];

export const mockBlogPosts = [
  { slug: "understanding-nda-risks", title: "5 NDA Clauses That Could Cost You", excerpt: "Non-disclosure agreements seem straightforward, but hidden clauses can create serious liability.", author: "Sarah Chen", date: "Jan 20, 2025", readingTime: "6 min", tags: ["NDA", "Risk Analysis"] },
  { slug: "ai-contract-review", title: "How AI Is Changing Contract Review", excerpt: "Legal teams are adopting AI tools to speed up document review without sacrificing accuracy.", author: "James Okafor", date: "Jan 15, 2025", readingTime: "8 min", tags: ["AI", "Legal Tech"] },
  { slug: "freelancer-contract-guide", title: "The Freelancer's Guide to Contract Red Flags", excerpt: "Before you sign your next client contract, watch out for these common pitfalls.", author: "Maria Rodriguez", date: "Jan 10, 2025", readingTime: "5 min", tags: ["Freelancers", "Contracts"] },
  { slug: "saas-terms-explained", title: "SaaS Terms of Service: What Actually Matters", excerpt: "We break down the key sections of SaaS agreements that users should actually read.", author: "Sarah Chen", date: "Jan 5, 2025", readingTime: "7 min", tags: ["SaaS", "Terms"] },
  { slug: "liability-caps-explained", title: "Liability Caps: How Much Risk Are You Taking?", excerpt: "Understanding liability limitations in commercial contracts and why they matter.", author: "James Okafor", date: "Dec 28, 2024", readingTime: "6 min", tags: ["Liability", "Risk Analysis"] },
  { slug: "ip-assignment-pitfalls", title: "IP Assignment Agreements: Common Mistakes", excerpt: "Intellectual property assignments can have lasting consequences if drafted poorly.", author: "Maria Rodriguez", date: "Dec 20, 2024", readingTime: "5 min", tags: ["IP", "Contracts"] },
];

export const mockPricing = {
  monthly: {
    starter: { price: "Free", docs: "5 documents/month", features: ["Plain-English explanations", "Basic risk flagging", "1 export/month"] },
    student: { price: "$5", docs: "15 documents/month", features: ["Plain-English explanations", "Full risk analysis", "Edit suggestions", "5 exports/month", "Student-verified access"] },
    pro: { price: "$29", docs: "50 documents/month", features: ["Full risk analysis", "Edit suggestions", "Unlimited exports", "Clause drafting", "Priority processing"] },
    team: { price: "$79", docs: "200 documents/month", features: ["Everything in Pro", "5 team seats", "Shared workspace", "Team document library", "Admin controls"] },
  },
  yearly: {
    starter: { price: "Free", docs: "5 documents/month", features: ["Plain-English explanations", "Basic risk flagging", "1 export/month"] },
    student: { price: "$4", docs: "15 documents/month", features: ["Plain-English explanations", "Full risk analysis", "Edit suggestions", "5 exports/month", "Student-verified access"] },
    pro: { price: "$24", docs: "50 documents/month", features: ["Full risk analysis", "Edit suggestions", "Unlimited exports", "Clause drafting", "Priority processing"] },
    team: { price: "$65", docs: "200 documents/month", features: ["Everything in Pro", "5 team seats", "Shared workspace", "Team document library", "Admin controls"] },
  },
};

export const mockFAQ = [
  { q: "What document formats does Juriq support?", a: "Juriq currently supports text-based PDFs and DOCX files. Scanned PDFs and image-based documents are not supported in this version." },
  { q: "How accurate is the risk analysis?", a: "Juriq provides AI-powered analysis as a starting point. It identifies common risk patterns but should not replace professional legal advice for critical decisions." },
  { q: "Can Juriq track changes like Microsoft Word?", a: "Juriq offers edit suggestions in a before/after redline-style view with diff highlighting. It does not integrate with Word's native Track Changes feature." },
  { q: "Is my data secure?", a: "Your documents are encrypted in transit. We do not share your data with third parties. You can request deletion of your data at any time." },
  { q: "Can I use Juriq for any type of legal document?", a: "Juriq works best with contracts, NDAs, service agreements, and similar commercial documents. It is not designed for litigation documents or regulatory filings." },
  { q: "What happens when I reach my document limit?", a: "On the free plan, you can analyze up to 5 documents per month. Upgrade to Pro or Team for higher limits." },
  { q: "Do you offer refunds?", a: "Yes, we offer a 14-day money-back guarantee on all paid plans. Contact support@juriq.com for assistance." },
];

export const mockInvoices = [
  { id: "INV-001", date: "Jan 1, 2025", amount: "$29.00", status: "Paid" },
  { id: "INV-002", date: "Dec 1, 2024", amount: "$29.00", status: "Paid" },
  { id: "INV-003", date: "Nov 1, 2024", amount: "$29.00", status: "Paid" },
];
