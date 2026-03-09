import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { mockBlogPosts } from "@/data/mockData";
import { Clock, ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { ease: "easeOut", duration: 0.5 },
  },
};

export default function Blog() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-full max-w-2xl h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground">Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights on contract review, legal tech, and the future of AI in law.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {mockBlogPosts.map((post) => (
            <motion.div key={post.slug} variants={itemVariants} whileHover={{ y: -8 }}>
              <Link
                to={`/blog/${post.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-1 flex-col">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] bg-secondary/50 border-border/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h2 className="font-display text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary mb-3">
                    {post.title}
                  </h2>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/30">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{post.author}</span>
                      <span>·</span>
                      <span>{post.date}</span>
                    </div>
                    <span className="flex items-center gap-1.5 text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 font-medium">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
