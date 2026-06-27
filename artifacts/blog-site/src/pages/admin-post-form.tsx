import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetPost, useCreatePost, useUpdatePost, getListPostsQueryKey, getGetPostStatsQueryKey, getGetPostQueryKey, getGetRecentPostsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Link } from "wouter";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  tags: z.string().optional(),
  published: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminPostForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id && id !== "new";
  const postId = isEditing ? parseInt(id, 10) : undefined;
  
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: post, isLoading: postLoading } = useGetPost(postId as number, {
    query: { enabled: isEditing, queryKey: getGetPostQueryKey(postId as number) }
  });

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      author: "Editor",
      tags: "",
      published: false,
    },
  });

  useEffect(() => {
    if (post && isEditing) {
      form.reset({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        author: post.author,
        tags: post.tags || "",
        published: post.published || false,
      });
    }
  }, [post, isEditing, form]);

  const onSubmit = (data: FormValues) => {
    if (isEditing) {
      updatePost.mutate({ id: postId as number, data }, {
        onSuccess: () => {
          toast.success("Manuscript updated");
          queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetPostStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetPostQueryKey(postId as number) });
          queryClient.invalidateQueries({ queryKey: getGetRecentPostsQueryKey() });
          setLocation("/admin");
        },
        onError: () => toast.error("Failed to update manuscript")
      });
    } else {
      createPost.mutate({ data }, {
        onSuccess: () => {
          toast.success("Manuscript created");
          queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetPostStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetRecentPostsQueryKey() });
          setLocation("/admin");
        },
        onError: () => toast.error("Failed to create manuscript")
      });
    }
  };

  const isPending = createPost.isPending || updatePost.isPending;

  if (isEditing && postLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to desk
          </Link>
          <h1 className="text-3xl font-serif">
            {isEditing ? 'Edit Manuscript' : 'New Manuscript'}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-serif text-base">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="A memorable title..." className="text-lg py-6 font-serif" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-serif text-base">Excerpt (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A brief summary for the index..." 
                          className="resize-none h-24" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-serif text-base">Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your essay here..." 
                          className="min-h-[400px] font-mono text-sm leading-relaxed p-4" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div className="bg-background border border-border p-6 shadow-sm space-y-6">
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-serif">Status</FormLabel>
                          <FormDescription>
                            Make public immediately
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-serif text-base">Author</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-serif text-base">Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Design, Culture" {...field} />
                        </FormControl>
                        <FormDescription>Comma separated</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full font-serif text-lg tracking-wide" disabled={isPending} data-testid="button-save-post">
                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {!isPending && <Save className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Save Changes' : 'Publish Draft'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
