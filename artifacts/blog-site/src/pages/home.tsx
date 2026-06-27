import { usePosts } from "@/store/posts-context";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { recentPosts } = usePosts();

  const featuredPost = recentPosts[0];
  const otherPosts = recentPosts.slice(1);

  return (
    <Layout>
      <section className="py-20 md:py-32 border-b border-border/40 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-serif leading-tight">
              The field guide to running Kubernetes in production.
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              The Daily Draft is a publication for platform engineers and developers — covering Kubernetes, containers, cloud-native infrastructure, and everything that keeps software running reliably at scale.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12 border-b border-border pb-4">
          <h2 className="text-2xl font-serif">Featured Reading</h2>
          <Link href="/posts" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          {featuredPost && (
            <div className="md:col-span-8 group">
              <Link href={`/posts/${featuredPost.id}`} className="block space-y-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="text-primary font-medium">{featuredPost.tags || "Article"}</span>
                  <span>&mdash;</span>
                  <time dateTime={featuredPost.createdAt}>{format(new Date(featuredPost.createdAt), "MMMM d, yyyy")}</time>
                </div>
                <h3 className="text-4xl md:text-5xl font-serif leading-tight group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h3>
                {featuredPost.excerpt && (
                  <p className="text-lg text-muted-foreground leading-relaxed">{featuredPost.excerpt}</p>
                )}
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs">
                    {featuredPost.author[0]}
                  </span>
                  {featuredPost.author}
                </div>
              </Link>
            </div>
          )}

          {otherPosts.length > 0 && (
            <div className="md:col-span-4 flex flex-col gap-10 border-t md:border-t-0 md:border-l border-border pt-10 md:pt-0 md:pl-10">
              {otherPosts.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/posts/${post.id}`} className="block space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="text-primary">{post.tags || "Article"}</span>
                    </div>
                    <h4 className="text-xl font-serif leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <time className="text-sm text-muted-foreground" dateTime={post.createdAt}>
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </time>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
