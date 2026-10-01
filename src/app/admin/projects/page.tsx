import { prisma } from "@/lib/db";
import ProjectManager from "./ProjectManager";

export const revalidate = 0;

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return <ProjectManager initialProjects={projects} />;
}
