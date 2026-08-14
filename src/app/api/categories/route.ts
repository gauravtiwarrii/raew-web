import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";
import { z } from "zod";

const imageRefSchema = z.string().trim().refine((value) => {
  if (!value) return true;
  if (value.startsWith("/")) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}, "Valid image URL or public path required");

const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens"),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  image: imageRefSchema.optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(999).optional().default(0),
  active: z.boolean().optional().default(true),
});

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid category data", details: parsed.error.format() }, { status: 400 });
    }

    const { description, image, ...safeData } = parsed.data;

    const newCategory = await prisma.category.create({
      data: {
        ...safeData,
        description: description || null,
        image: image || null,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error("Category POST error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Category slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
