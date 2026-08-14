import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";
import { z } from "zod";

const imageRefSchema = z.string().trim().refine((value) => {
  if (value.startsWith("/")) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}, "Valid image URL or public path required");

const jsonStringSchema = z.string().trim().refine((value) => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}, "Must be valid JSON");

const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens"),
  categoryId: z.string().trim().min(1, "Category is required").max(80),
  shortDescription: z.string().trim().min(5, "Short description required").max(280),
  description: z.string().trim().min(10, "Full description required").max(5000),
  specifications: jsonStringSchema,
  features: jsonStringSchema,
  applications: jsonStringSchema,
  image: imageRefSchema,
  galleryImages: jsonStringSchema.optional().default("[]"),
  priceDisplay: z.string().trim().max(80).optional().default("Price on Request"),
  availability: z.string().trim().max(80).optional().default("In Stock"),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const categorySlug = searchParams.get("category");
    const featuredOnly = searchParams.get("featured") === "true";
    const activeOnly = searchParams.get("activeOnly") !== "false"; // Default true for public

    const whereClause: any = {};

    if (activeOnly) {
      whereClause.active = true;
    }

    if (featuredOnly) {
      whereClause.featured = true;
    }

    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { shortDescription: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product data", details: parsed.error.format() }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: parsed.data,
      include: { category: true },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Product POST error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
