import { usePosts } from "@/store/posts-context";
import { Layout } from "@/components/layout";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id, 10);
  const { getPost } = usePosts();
  const post = getPost(postId);

  return (
    <Layout>
      <article className="py-16 md:py-24">
        {!post ? (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center py-20">
            <h1 className="text-3xl font-serif mb-4">Post not found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/posts" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to all articles
            </Link>
          </div>
        ) : (
          <>
            <header className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-16 space-y-8">
              <div className="flex items-center justify-center gap-3 text-sm text-primary uppercase tracking-widest font-medium">
                <span>{post.tags || "Article"}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight">{post.title}</h1>
              {post.excerpt && (
                <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center font-medium">
                    {post.author[0]}
                  </span>
                  <span className="font-medium text-foreground">{post.author}</span>
                </div>
                <span>&middot;</span>
                <time dateTime={post.createdAt}>{format(new Date(post.createdAt), "MMMM d, yyyy")}</time>
              </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 sm:px-6">
              <div className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:border-primary prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:font-light">
                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }} />
              </div>
              <div className="mt-16 pt-8 border-t border-border">
                <Link href="/posts" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium">
                  <ArrowLeft className="w-4 h-4" /> Back to all articles
                </Link>
              </div>
            </div>
          </>
        )}
      </article>
    </Layout>
  );
}
