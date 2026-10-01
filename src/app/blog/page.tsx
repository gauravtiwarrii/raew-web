import { ArrowRight, Clock, FileText } from "lucide-react";
import Link from "next/link";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "News & Insights",
  description: "Latest news, updates, and insights from M/s Raj Agro Engineering Works.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 60;

interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  createdAt: Date;
}

const DEMO_POSTS: BlogListItem[] = [
  {
    id: "demo-1",
    title: "Choosing the Right Rotary Tiller for Your Soil Type",
    slug: "choosing-right-rotary-tiller-soil-type",
    excerpt: "Understanding soil conditions is the first step to selecting agricultural machinery.",
    category: "Agriculture",
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "demo-2",
    title: "Why Precision Land Leveling Matters for Irrigation Efficiency",
    slug: "precision-land-leveling-irrigation-efficiency",
    excerpt: "A level field distributes water evenly, reduces waste, and improves crop uniformity.",
    category: "Land Leveling",
    createdAt: new Date("2024-02-28"),
  },
  {
    id: "demo-3",
    title: "Maintaining Your Agricultural Machinery Between Seasons",
    slug: "maintaining-agricultural-machinery-between-seasons",
    excerpt: "A short seasonal maintenance routine can extend the life of your equipment.",
    category: "Maintenance",
    createdAt: new Date("2024-01-20"),
  },
];

async function getPosts(): Promise<BlogListItem[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 24,
    });
    if (posts.length > 0) return posts;
  } catch (error) {
    console.error("Blog list fetch error:", error);
  }
  return DEMO_POSTS;
}

export default async function BlogPage() {
  const posts = await getPosts();
  const usingDemo = posts.length > 0 && posts[0].id.startsWith("demo-");

  return (
    <div className="bg-[var(--bg)]">
      <section className="steel-plate on-dark relative overflow-hidden border-b border-[var(--border-inverse)]">
        <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="shell relative py-16 sm:py-20">
          <AnimatedSection variant="fadeUp" delay={0.1}>
            <p className="eyebrow text-[var(--accent-on-dark)]">
              <FileText className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
              News and Insights
            </p>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.2}>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Latest from RAEW
            </h1>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.3}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-inverse-muted)] sm:text-base">
              Updates, insights, and practical guidance on agricultural machinery, land leveling, custom fabrication, and farm equipment maintenance.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          {usingDemo && (
            <p className="mb-6 border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-xs leading-relaxed text-[var(--text-muted)]">
              Showing introductory articles. Publish posts from the admin panel and they will appear here automatically.
            </p>
          )}

          <AnimatedSection variant="fadeUp">
            <StaggerContainer
              className="grid grid-cols-1 gap-px border border-[var(--border)] sm:grid-cols-2 lg:grid-cols-3"
              staggerDelay={0.08}
            >
              {posts.map((post) => (
                <StaggerItem key={post.id} className="bg-[var(--surface)] p-6">
                  <article className="group">
                    {post.category && (
                      <span className="inline-block rounded-full border border-[var(--border-strong)] bg-[var(--border)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                        {post.category}
                      </span>
                    )}
                    <h2 className="mt-4 text-lg font-bold leading-snug tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
                      <Link href={`/blog/${post.slug}`} className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]">
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-muted)] line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-xs text-[var(--text-subtle)]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                    >
                      Read article <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </AnimatedSection>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface-2)] py-16 sm:py-20">
        <div className="shell">
          <div className="mx-auto max-w-3xl text-center">
            <AnimatedSection variant="fadeUp">
              <p className="eyebrow text-[var(--accent)]">Have a Question?</p>
              <h2 className="mt-4 text-display-2 font-bold tracking-tight text-[var(--text)] sm:text-3xl">Talk to Our Team</h2>
              <p className="mt-5 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">Have a question about our machinery, services, or capabilities? Our team is here to help.</p>
            </AnimatedSection>
            <AnimatedSection variant="fadeUp" delay={0.1}>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row justify-center">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent-fg)] hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]">
                  Contact Us
                </Link>
                <a href="https://wa.me/917651861335?text=Hello, I have a question about your machinery." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-[var(--border-strong)] px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:w-auto">
                  WhatsApp Us
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--surface-2)] py-12">
        <div className="shell">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-xs leading-relaxed text-[var(--text-subtle)] sm:text-center">M/s Raj Agro Engineering Works - News and Insights</p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--text-subtle)]">
              <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
              <Link href="/products" className="hover:text-[var(--accent)]">Products</Link>
              <Link href="/about" className="hover:text-[var(--accent)]">About</Link>
              <Link href="/contact" className="hover:text-[var(--accent)]">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
