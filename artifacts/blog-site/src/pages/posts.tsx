import { useListPosts } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Posts() {
  const { data: posts, isLoading } = useListPosts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(
    new Set(posts?.map(p => p.tags).filter(Boolean) as string[])
  );

  const filteredPosts = posts?.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? post.tags === selectedTag : true;
    return matchesSearch && matchesTag;
  });

  return (
    <Layout>
      <div className="bg-card/50 border-b border-border py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif mb-6">Archive</h1>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Search essays..." 
                className="pl-9 bg-background border-border/60 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-posts"
              />
            </div>
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={selectedTag === null ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => setSelectedTag(null)}
                >
                  All
                </Badge>
                {allTags.map(tag => (
                  <Badge 
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : filteredPosts?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No essays found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-12 md:gap-y-16">
            {filteredPosts?.map((post) => (
              <article key={post.id} className="group flex flex-col items-start" data-testid={`card-post-${post.id}`}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <time dateTime={post.createdAt}>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</time>
                  <span>&middot;</span>
                  <span className="text-primary uppercase tracking-wider">{post.tags || 'Essay'}</span>
                </div>
                <Link href={`/posts/${post.id}`} className="block flex-1 mb-4">
                  <h2 className="text-2xl font-serif leading-snug mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-sm font-medium">{post.author}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
