import { useGetPostStats, useListPosts, useDeletePost, getListPostsQueryKey, getGetPostStatsQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { format } from "date-fns";
import { Plus, Edit2, Trash2, FileText, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  const { data: stats, isLoading: statsLoading } = useGetPostStats();
  const { data: posts, isLoading: postsLoading } = useListPosts();
  const deletePost = useDeletePost();
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    deletePost.mutate({ id }, {
      onSuccess: () => {
        toast.success("Post deleted successfully");
        queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetPostStatsQueryKey() });
      },
      onError: () => {
        toast.error("Failed to delete post");
      }
    });
  };

  return (
    <Layout>
      <div className="bg-card border-b border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif">Publisher Desk</h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage your essays and drafts.</p>
          </div>
          <Link href="/admin/new">
            <Button className="font-serif tracking-wide" data-testid="button-new-post">
              <Plus className="w-4 h-4 mr-2" /> New Draft
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-background border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <FileText className="w-5 h-5" />
              <h3 className="font-medium">Total Posts</h3>
            </div>
            {statsLoading ? <Skeleton className="h-10 w-16" /> : <p className="text-4xl font-serif">{stats?.total || 0}</p>}
          </div>
          <div className="bg-background border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <CheckCircle className="w-5 h-5" />
              <h3 className="font-medium">Published</h3>
            </div>
            {statsLoading ? <Skeleton className="h-10 w-16" /> : <p className="text-4xl font-serif">{stats?.published || 0}</p>}
          </div>
          <div className="bg-background border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <Clock className="w-5 h-5" />
              <h3 className="font-medium">Drafts</h3>
            </div>
            {statsLoading ? <Skeleton className="h-10 w-16" /> : <p className="text-4xl font-serif">{stats?.drafts || 0}</p>}
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-background border border-border shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-serif">All Manuscripts</h2>
          </div>
          
          <div className="divide-y divide-border">
            {postsLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="p-6 flex items-center justify-between">
                  <div className="space-y-2 w-1/2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))
            ) : posts?.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <p>Your desk is empty. Time to start writing.</p>
              </div>
            ) : (
              posts?.map((post) => (
                <div key={post.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-card/50 transition-colors" data-testid={`row-post-${post.id}`}>
                  <div>
                    <Link href={`/posts/${post.id}`} className="block hover:text-primary transition-colors">
                      <h3 className="text-lg font-serif font-medium">{post.title}</h3>
                    </Link>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                      <span>&middot;</span>
                      <span>{post.author}</span>
                      {post.tags && (
                        <>
                          <span>&middot;</span>
                          <span className="truncate max-w-[150px]">{post.tags}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                    
                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/edit/${post.id}`}>
                        <Button variant="outline" size="icon" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-serif">Delete manuscript?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete "{post.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
