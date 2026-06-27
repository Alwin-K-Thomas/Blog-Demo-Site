import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Post, STATIC_POSTS } from "@/data/posts";

let nextId = Math.max(...STATIC_POSTS.map((p) => p.id)) + 1;

interface PostsContextValue {
  posts: Post[];
  getPost: (id: number) => Post | undefined;
  createPost: (data: Omit<Post, "id" | "createdAt" | "updatedAt">) => Post;
  updatePost: (id: number, data: Partial<Omit<Post, "id" | "createdAt" | "updatedAt">>) => Post | undefined;
  deletePost: (id: number) => void;
  stats: { total: number; published: number; drafts: number };
  recentPosts: Post[];
}

const PostsContext = createContext<PostsContextValue | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(STATIC_POSTS);

  const getPost = useCallback((id: number) => posts.find((p) => p.id === id), [posts]);

  const createPost = useCallback((data: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const post: Post = { ...data, id: nextId++, createdAt: now, updatedAt: now };
    setPosts((prev) => [post, ...prev]);
    return post;
  }, []);

  const updatePost = useCallback((id: number, data: Partial<Omit<Post, "id" | "createdAt" | "updatedAt">>) => {
    let updated: Post | undefined;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        updated = { ...p, ...data, updatedAt: new Date().toISOString() };
        return updated;
      })
    );
    return updated;
  }, []);

  const deletePost = useCallback((id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const published = posts.filter((p) => p.published);
  const stats = { total: posts.length, published: published.length, drafts: posts.length - published.length };
  const recentPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  return (
    <PostsContext.Provider value={{ posts, getPost, createPost, updatePost, deletePost, stats, recentPosts }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used within PostsProvider");
  return ctx;
}
