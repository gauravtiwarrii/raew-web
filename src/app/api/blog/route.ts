import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(180),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens"),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  content: z.string().trim().min(10, "Content is required"),
  coverImage: z.string().trim().max(500).optional().or(z.literal("")),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  tags: z.string().trim().optional().default("[]"),
  seoTitle: z.string().trim().max(180).optional().or(z.literal("")),
  seoDesc: z.string().trim().max(320).optional().or(z.literal("")),
  published: z.boolean().optional().default(false),
  author: z.string().trim().max(120).optional().or(z.literal("")),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get("publishedOnly") !== "false";
    const whereClause: Record<string, unknown> = {};
    if (publishedOnly) whereClause.published = true;
    const posts = await prisma.blogPost.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Blog GET error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const body = await req.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid post data", details: parsed.error.format() }, { status: 400 });
    }
    const created = await prisma.blogPost.create({ data: parsed.data });
    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    console.error("Blog POST error:", error);
    const code = (error as { code?: string }).code;
    if (code === "P2002") {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
