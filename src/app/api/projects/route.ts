import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;
  try {
    const body = await req.json();
    const created = await prisma.project.create({
      data: {
        title: String(body.title || "").trim(),
        slug: String(body.slug || "").trim(),
        client: body.client || null,
        application: body.application || null,
        equipment: body.equipment || null,
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        imageType: body.imageType || "STOCK_LICENSED",
        completionDate: body.completionDate || null,
        active: body.active !== undefined ? Boolean(body.active) : true,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Project POST error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
