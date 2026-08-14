import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";
import { DEFAULT_SITE_CONFIG } from "@/lib/config";
import { applySiteSettings } from "@/lib/site-settings";

export async function GET() {
  try {
    const dbSettings = await prisma.siteSetting.findMany();
    return NextResponse.json(applySiteSettings(dbSettings));
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(DEFAULT_SITE_CONFIG);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const body = await req.json(); // Object with key-value pairs

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        const uppercaseKey = key.replace(/([A-Z])/g, "_$1").toUpperCase();
        await prisma.siteSetting.upsert({
          where: { key: uppercaseKey },
          update: { value },
          create: { key: uppercaseKey, value, group: "GENERAL" },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Site settings updated successfully" });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
