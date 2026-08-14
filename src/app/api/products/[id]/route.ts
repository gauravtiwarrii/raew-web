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

const productUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  categoryId: z.string().trim().min(1).max(80).optional(),
  shortDescription: z.string().trim().min(5).max(280).optional(),
  description: z.string().trim().min(10).max(5000).optional(),
  specifications: jsonStringSchema.optional(),
  features: jsonStringSchema.optional(),
  applications: jsonStringSchema.optional(),
  image: imageRefSchema.optional(),
  galleryImages: jsonStringSchema.optional(),
  priceDisplay: z.string().trim().max(80).optional(),
  availability: z.string().trim().max(80).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Can search by id OR slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = productUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product data", details: parsed.error.format() }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: parsed.data,
      include: { category: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Product PUT error:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Product DELETE error:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
