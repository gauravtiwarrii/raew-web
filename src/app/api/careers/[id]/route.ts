import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";
import { z } from "zod";

const jobUpdateSchema = z.object({
  title: z.string().trim().min(3).max(160).optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  department: z.string().trim().max(120).optional().or(z.literal("")),
  location: z.string().trim().min(2).max(160).optional(),
  type: z.string().trim().max(60).optional(),
  description: z.string().trim().min(10).optional(),
  requirements: z.string().trim().optional(),
  responsibilities: z.string().trim().optional(),
  active: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = jobUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid job data", details: parsed.error.format() }, { status: 400 });
    }
    const updated = await prisma.jobPost.update({ where: { id }, data: parsed.data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Job PUT error:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;
  try {
    const { id } = await params;
    await prisma.jobPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Job DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
  }
}
