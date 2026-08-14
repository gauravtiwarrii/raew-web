import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Gallery GET error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const body = await req.json();
    const { title, category, imageUrl, description, active } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Title and Image URL are required" }, { status: 400 });
    }

    const newItem = await prisma.galleryItem.create({
      data: {
        title,
        category: category || "General",
        imageUrl,
        description: description || null,
        active: active !== undefined ? active : true,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}
