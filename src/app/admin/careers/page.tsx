import { prisma } from "@/lib/db";
import CareerManager from "./CareerManager";

export const revalidate = 0;

export default async function AdminCareersPage() {
  const jobs = await prisma.jobPost.findMany({ orderBy: { createdAt: "desc" } });
  const applications = await prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  const serialised = applications.map((a) => ({ ...a, phone: a.phone ?? null, createdAt: a.createdAt.toISOString(), updatedAt: a.updatedAt.toISOString() }));
  return <CareerManager initialJobs={jobs} initialApplications={serialised} />;
}
