import { useGetPost } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { useParams } from "wouter";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id, 10);
  
  const { data: post, isLoading, isError } = useGetPost(postId);

  return (
    <Layout>
      <article className="py-16 md:py-24">
        {isLoading ? (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-2/3 mx-auto" />
            <div className="pt-12 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : isError || !post ? (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center py-20">
            <h1 className="text-3xl font-serif mb-4">Post not found</h1>
            <p className="text-muted-foreground">The essay you're looking for doesn't exist or has been removed.</p>
          </div>
        ) : (
          <>
            <header className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-16 space-y-8">
              <div className="flex items-center justify-center gap-3 text-sm text-primary uppercase tracking-widest font-medium">
                <span>{post.tags || 'Essay'}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight">
                {post.title}
              </h1>
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
                <time dateTime={post.createdAt}>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</time>
              </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 sm:px-6">
              <div className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:border-primary prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:font-light">
                {/* For a real app this would use a markdown parser, but we'll assume content is simple text or HTML for now */}
                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          </>
        )}
      </article>
    </Layout>
  );
}
