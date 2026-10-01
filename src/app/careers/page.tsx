import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { prisma } from "@/lib/db";
import CareerApplicationForm from "./CareerApplicationForm";

export const metadata = {
  title: "Careers",
  description: "Join M/s Raj Agro Engineering Works. Open roles in fabrication, assembly, sales, and support.",
  alternates: { canonical: "/careers" },
};

export const revalidate = 60;

export default async function CareersPage() {
  let jobs: { id: string; title: string; department: string | null; location: string; type: string; description: string }[] = [];
  try {
    jobs = await prisma.jobPost.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Careers page fetch error:", error);
  }

  return (
    <div className="bg-[var(--bg)]">
      <section className="steel-plate on-dark relative overflow-hidden border-b border-[var(--border-inverse)]">
        <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="shell relative py-16 sm:py-20">
          <AnimatedSection variant="fadeUp" delay={0.1}>
            <p className="eyebrow text-[var(--accent-on-dark)]">
              <Briefcase className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
              Work With Us
            </p>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.2}>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Build With RAEW
            </h1>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.3}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-inverse-muted)] sm:text-base">
              Fabrication, assembly, fitting, sales, and support. If you take pride in machines that work as hard as the people who run them, we want to hear from you.
            </p>
          </AnimatedSection>
        </div>
      </section>
      <section className="shell py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          {jobs.length === 0 ? (
            <AnimatedSection variant="fadeUp">
              <div className="border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
                <Briefcase className="mx-auto h-8 w-8 text-[var(--text-subtle)]" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-bold text-[var(--text)]">No open roles right now</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
                  We hire fabricators, fitters, welders, and field support staff as work grows. Send your details through the contact form and we will keep them on file.
                </p>
                <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--accent-fg)] hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]">
                  Contact Us <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </AnimatedSection>
          ) : (
            <AnimatedSection variant="fadeUp">
              <StaggerContainer className="grid grid-cols-1 gap-px border border-[var(--border)]" staggerDelay={0.08}>
                {jobs.map((job) => (
                  <StaggerItem key={job.id} className="bg-[var(--surface)] p-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                      <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">{job.title}</h2>
                      <p className="shrink-0 text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">{job.type} · {job.location}</p>
                    </div>
                    {job.department && <p className="spec-label mt-2">{job.department}</p>}
                    <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-muted)] line-clamp-4">{job.description}</p>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* The application form is only offered when there is at least one open
          role. `JobApplication.jobId` is a real foreign key, so a "general
          application" with no role to point at would be rejected by the
          database — and inventing a placeholder row to satisfy it would put a
          fake vacancy on the public page. With no roles open the empty state
          above routes applicants to the contact form instead, which works. */}
      {jobs.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--surface-2)] py-16 sm:py-20">
          <div className="shell">
            <AnimatedSection variant="fadeUp">
              <div className="mx-auto max-w-3xl">
                <CareerApplicationForm
                  jobs={jobs.map((job) => ({ id: job.id, title: job.title }))}
                />
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </div>
  );
}
