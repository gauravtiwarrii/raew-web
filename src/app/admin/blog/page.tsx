import { prisma } from "@/lib/db";
import BlogManager from "./BlogManager";

export const revalidate = 0;

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  const serialised = posts.map((p) => ({ ...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }));
  return <BlogManager initialPosts={serialised} />;
}
