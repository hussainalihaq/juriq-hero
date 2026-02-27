import { useParams, Link } from "react-router-dom";
import { mockBlogPosts } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Share2, Twitter, Linkedin } from "lucide-react";

const placeholderContent = [
  "Legal documents form the backbone of every business relationship. Yet most people sign contracts without fully understanding what they're agreeing to. This is where AI-powered contract analysis can make a significant difference.",
  "The challenge isn't just about reading the text — it's about understanding the implications. A clause that seems straightforward on the surface might create unexpected obligations or expose you to significant liability.",
  "Modern AI tools can identify patterns across thousands of contracts, flagging clauses that deviate from standard practice. This doesn't replace legal advice, but it gives non-lawyers a starting point for understanding what they're signing.",
  "When reviewing any contract, focus on these key areas: liability limitations (or lack thereof), termination conditions, intellectual property ownership, payment terms, and confidentiality obligations.",
  "The most common red flags we see include uncapped liability clauses, non-compete provisions hidden in non-disclosure agreements, automatic renewal terms with long notice periods, and broad intellectual property assignment language.",
  "Remember: AI analysis is a tool, not a substitute for professional legal advice. For critical agreements, always consult with a qualified attorney.",
];

const toc = [
  "Why contract review matters",
  "Common challenges",
  "How AI helps",
  "Key areas to focus on",
  "Red flags to watch for",
  "Final thoughts",
];

export default function BlogPost() {
  const { slug } = useParams();
  const post = mockBlogPosts.find((p) => p.slug === slug) || mockBlogPosts[0];

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/blog" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-default">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
          ))}
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{post.title}</h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime}
          </span>
        </div>

        {/* Share buttons UI */}
        <div className="mt-6 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Share:</span>
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-default">
            <Twitter className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-default">
            <Linkedin className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-default">
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Table of contents */}
        <div className="mt-8 rounded-xl border border-border/50 bg-card p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-foreground">Table of Contents</h3>
          <ul className="space-y-1.5">
            {toc.map((item, i) => (
              <li key={i}>
                <a href={`#section-${i}`} className="text-sm text-link hover:text-foreground transition-default">
                  {i + 1}. {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <article className="mt-10 space-y-8">
          {toc.map((heading, i) => (
            <section key={i} id={`section-${i}`}>
              <h2 className="font-display text-xl font-bold text-foreground">{heading}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{placeholderContent[i]}</p>
            </section>
          ))}
        </article>

        {/* CTA */}
        <div className="mt-16 rounded-xl border border-border/50 bg-card p-8 text-center">
          <h3 className="font-display text-xl font-bold text-foreground">
            Ready to review your contracts with AI?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the waitlist for early access to Juriq.
          </p>
          <Button variant="hero" size="lg" className="mt-4" asChild>
            <Link to="/waitlist">Join Waitlist</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
