import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { mockBlogPosts } from "@/data/mockData";
import { Clock, ArrowRight } from "lucide-react";

export default function Blog() {
  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground">Blog</h1>
          <p className="mt-3 text-muted-foreground">Insights on contract review, legal tech, and AI.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockBlogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group rounded-xl border border-border/50 bg-card p-6 transition-default hover:border-border"
            >
              <div className="mb-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
              <h2 className="font-display text-base font-semibold text-foreground group-hover:text-link transition-default">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{post.author}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
