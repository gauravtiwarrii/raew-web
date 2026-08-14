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

const categoryUpdateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  image: imageRefSchema.optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(999).optional(),
  active: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = categoryUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid category data", details: parsed.error.format() }, { status: 400 });
    }

    const { description, image, ...safeData } = parsed.data;

    const updated = await prisma.category.update({
      where: { id: id },
      data: {
        ...safeData,
        ...(description !== undefined ? { description: description || null } : {}),
        ...(image !== undefined ? { image: image || null } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Category PUT error:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Category slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const { id } = await params;
    const productCount = await prisma.product.count({ where: { categoryId: id } });

    if (productCount > 0) {
      return NextResponse.json(
        { error: "Move or delete products in this category before deleting it." },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("Category DELETE error:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
