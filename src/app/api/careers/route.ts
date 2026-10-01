import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  department: z.string().trim().max(120).optional().or(z.literal("")),
  location: z.string().trim().min(2, "Location is required").max(160),
  type: z.string().trim().max(60).optional().default("Full-time"),
  description: z.string().trim().min(10, "Description is required"),
  requirements: z.string().trim().optional().default("[]"),
  responsibilities: z.string().trim().optional().default("[]"),
  active: z.boolean().optional().default(true),
});


const applicationSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(160),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  jobId: z.string().trim().min(1, "Role is required"),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  website: z.string().optional(),
  /**
   * Either a bounded `data:` URL produced by the browser FileReader on the
   * careers form, or a plain https link to an online CV. The client checks the
   * type and size before reading the file; this is the check that actually
   * matters, because the client one can be bypassed.
   *
   * The ceiling matches the form's 2 MB limit: base64 inflates by roughly 4/3,
   * plus the `data:...;base64,` header, so 2 MB of file cannot exceed it.
   */
  resumeUrl: z
    .string()
    .trim()
    .max(2_800_000, "Attachment is too large (2 MB maximum)")
    .refine((value) => {
      if (value.startsWith("data:")) {
        return /^data:(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingdocument);base64,[A-Za-z0-9+/=]+$/.test(
          value
        );
      }
      try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    }, "Attach a PDF, DOC or DOCX file under 2 MB, or provide a valid link")
    .optional()
    .or(z.literal("")),
});

export async function GET() {
  try {
    const jobs = await prisma.jobPost.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Jobs GET error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  if (body.jobId && body.email && !body.title) {
    const rateLimited = rateLimit(req, { keyPrefix: "career-apply", max: 5, windowMs: 10 * 60 * 1000 });
    if (rateLimited) return rateLimited;
    if (body.website) {
      return NextResponse.json({ success: true, message: "Application received." }, { status: 201 });
    }
    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }
    try {
      const { website, ...data } = parsed.data;
      const created = await prisma.jobApplication.create({
        data: {
          ...data,
          phone: data.phone || null,
          message: data.message || null,
          resumeUrl: data.resumeUrl || null,
          status: "NEW",
        },
      });
      return NextResponse.json({ success: true, message: "Application received.", id: created.id }, { status: 201 });
    } catch (error) {
      console.error("Application POST error:", error);
      return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
    }
  }

  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response!;
  try {
    const parsed = jobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid job data", details: parsed.error.format() }, { status: 400 });
    }
    const created = await prisma.jobPost.create({ data: parsed.data });
    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    console.error("Job POST error:", error);
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "A role with this slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}
