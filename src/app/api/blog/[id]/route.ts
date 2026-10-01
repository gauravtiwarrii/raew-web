import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";
import { z } from "zod";

const blogUpdateSchema = z.object({
  title: z.string().trim().min(3).max(180).optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  content: z.string().trim().min(10).optional(),
  coverImage: z.string().trim().max(500).optional().or(z.literal("")),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  tags: z.string().trim().optional(),
  seoTitle: z.string().trim().max(180).optional().or(z.literal("")),
  seoDesc: z.string().trim().max(320).optional().or(z.literal("")),
  published: z.boolean().optional(),
  author: z.string().trim().max(120).optional().or(z.literal("")),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = blogUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid post data", details: parsed.error.format() }, { status: 400 });
    }
    const updated = await prisma.blogPost.update({ where: { id }, data: parsed.data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Blog PUT error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;
  try {
    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Blog DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
