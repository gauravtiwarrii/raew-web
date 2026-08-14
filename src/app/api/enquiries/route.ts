import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{8,20}$/, "Valid phone number is required"),
  email: z.string().trim().email("Invalid email address").max(160).optional().or(z.literal("")),
  productId: z.string().trim().max(80).optional().or(z.literal("")),
  productTitle: z.string().trim().max(160).optional().or(z.literal("")),
  quantity: z.coerce.number().int().positive().max(999).default(1),
  location: z.string().trim().min(2, "Location/City is required").max(120),
  message: z.string().trim().min(5, "Message details are required").max(2000),
  source: z.enum(["WEBSITE", "CONTACT_FORM", "QUOTE_FORM", "WHATSAPP"]).default("WEBSITE"),
  website: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const whereClause: any = {};
    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { company: { contains: search } },
        { location: { contains: search } },
        { message: { contains: search } },
      ];
    }

    const enquiries = await prisma.enquiry.findMany({
      where: whereClause,
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("Enquiries GET error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const rateLimited = rateLimit(req, {
    keyPrefix: "enquiry",
    max: 8,
    windowMs: 10 * 60 * 1000,
  });
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json();

    if (body.website) {
      return NextResponse.json({
        success: true,
        message: "Your enquiry has been received successfully. Our team will contact you shortly.",
      }, { status: 201 });
    }

    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const { website, productId, email, company, productTitle, ...safeData } = parsed.data;

    const newEnquiry = await prisma.enquiry.create({
      data: {
        ...safeData,
        company: company || null,
        email: email || null,
        productId: productId || undefined,
        productTitle: productTitle || undefined,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your enquiry has been received successfully. Our team will contact you shortly.",
      enquiryId: newEnquiry.id,
    }, { status: 201 });
  } catch (error) {
    console.error("Enquiry POST error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}
