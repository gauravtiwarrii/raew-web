import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.enquiry.update({
      where: { id: id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Enquiry PUT error:", error);
    return NextResponse.json({ error: "Failed to update enquiry status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const { id } = await params;

    await prisma.enquiry.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Enquiry DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
