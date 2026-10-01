import { ArrowRight, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";
import { prisma } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in";

export const revalidate = 60;

interface BlogDetailProps {
  params: Promise<{ slug: string }>;
}

async function findPost(slug: string) {
  try {
    return await prisma.blogPost.findFirst({
      where: { OR: [{ slug }, { id: slug }], published: true },
    });
  } catch (error) {
    console.error("Blog post fetch error:", error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) return { title: "Article Not Found", robots: { index: false, follow: false } };
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt || post.title,
    alternates: { canonical },
  };
}

export default async function BlogPostPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) notFound();

  return (
    <div className="bg-[var(--bg)]">
      <section className="steel-plate on-dark relative overflow-hidden border-b border-[var(--border-inverse)]">
        <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="shell relative py-16 sm:py-20">
          <AnimatedSection variant="fadeUp" delay={0.1}>
            <p className="eyebrow text-[var(--accent-on-dark)]">
              <FileText className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
              {post.category || "News and Insights"}
            </p>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.2}>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.3}>
            <p className="mt-5 flex items-center gap-2 text-xs text-[var(--text-inverse-muted)]">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              {post.author ? ` · By ${post.author}` : ""}
            </p>
          </AnimatedSection>
        </div>
      </section>
      <section className="shell py-12 sm:py-16">
        <AnimatedSection variant="fadeUp">
          <article className="mx-auto max-w-3xl">
            {post.excerpt && (
              <p className="text-lg font-medium leading-relaxed text-[var(--text)]">{post.excerpt}</p>
            )}
            <div
              className="prose-raew mt-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <Link href="/blog" className="mt-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]">
              <ArrowRight className="h-3.5 w-3.5 rotate-180" aria-hidden="true" />
              Back to all articles
            </Link>
          </article>
        </AnimatedSection>
      </section>
    </div>
  );
}
