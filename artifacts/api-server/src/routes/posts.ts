import { Router } from "express";
import { db } from "@workspace/db";
import { postsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  CreatePostBody,
  UpdatePostBody,
  GetPostParams,
  UpdatePostParams,
  DeletePostParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/posts", async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(postsTable)
      .orderBy(desc(postsTable.createdAt));
    res.json(posts);
  } catch (err) {
    req.log.error({ err }, "Failed to list posts");
    res.status(500).json({ error: "Failed to list posts" });
  }
});

router.get("/posts/stats", async (req, res) => {
  try {
    const all = await db.select().from(postsTable);
    const published = all.filter((p) => p.published).length;
    res.json({
      total: all.length,
      published,
      drafts: all.length - published,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Failed to get stats" });
  }
});

router.get("/posts/recent", async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(postsTable)
      .orderBy(desc(postsTable.createdAt))
      .limit(3);
    res.json(posts);
  } catch (err) {
    req.log.error({ err }, "Failed to get recent posts");
    res.status(500).json({ error: "Failed to get recent posts" });
  }
});

router.post("/posts", async (req, res) => {
  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  try {
    const [post] = await db
      .insert(postsTable)
      .values({
        ...parsed.data,
        published: parsed.data.published ?? true,
      })
      .returning();
    res.status(201).json(post);
  } catch (err) {
    req.log.error({ err }, "Failed to create post");
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.get("/posts/:id", async (req, res) => {
  const { id } = GetPostParams.parse({ id: Number(req.params.id) });
  try {
    const [post] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, id));
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    req.log.error({ err }, "Failed to get post");
    res.status(500).json({ error: "Failed to get post" });
  }
});

router.patch("/posts/:id", async (req, res) => {
  const { id } = UpdatePostParams.parse({ id: Number(req.params.id) });
  const parsed = UpdatePostBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  try {
    const [post] = await db
      .update(postsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(postsTable.id, id))
      .returning();
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    req.log.error({ err }, "Failed to update post");
    res.status(500).json({ error: "Failed to update post" });
  }
});

router.delete("/posts/:id", async (req, res) => {
  const { id } = DeletePostParams.parse({ id: Number(req.params.id) });
  try {
    const [deleted] = await db
      .delete(postsTable)
      .where(eq(postsTable.id, id))
      .returning();
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete post");
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
