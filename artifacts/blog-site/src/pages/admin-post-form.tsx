import { useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePosts } from "@/store/posts-context";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

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
  const isEditing = !!id;
  const postId = isEditing ? parseInt(id, 10) : undefined;

  const [, setLocation] = useLocation();
  const { getPost, createPost, updatePost } = usePosts();

  const post = postId !== undefined ? getPost(postId) : undefined;

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
    if (isEditing && postId !== undefined) {
      updatePost(postId, {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        author: data.author,
        tags: data.tags || null,
        published: data.published,
      });
      toast.success("Manuscript updated");
    } else {
      createPost({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        author: data.author,
        tags: data.tags || null,
        published: data.published,
      });
      toast.success("Manuscript created");
    }
    setLocation("/admin");
  };

  if (isEditing && !post) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-3xl font-serif mb-4">Post not found</h1>
          <Link href="/admin" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to desk
          </Link>
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
          <h1 className="text-3xl font-serif">{isEditing ? "Edit Manuscript" : "New Manuscript"}</h1>
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
                        <Input placeholder="A memorable title..." className="text-lg py-6 font-serif" {...field} data-testid="input-title" />
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
                          data-testid="input-excerpt"
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
                          placeholder="Write your article here..."
                          className="min-h-[400px] font-mono text-sm leading-relaxed p-4"
                          {...field}
                          data-testid="input-content"
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
                          <FormDescription>Make public immediately</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-published" />
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
                          <Input {...field} data-testid="input-author" />
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
                          <Input placeholder="e.g. kubernetes, networking" {...field} data-testid="input-tags" />
                        </FormControl>
                        <FormDescription>Comma separated</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full font-serif text-lg tracking-wide"
                    data-testid="button-save-post"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? "Save Changes" : "Publish Draft"}
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
