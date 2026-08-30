import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import {
  CheckCircle,
  Wrench,
  FileText,
  MessageSquare,
  ChevronRight,
  Phone,
} from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import ProductImageGallery from "./ProductImageGallery";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { parseJson } from "@/lib/safe-json";
import { getSiteConfig } from "@/lib/site-settings";

export const revalidate = 30;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

/** Narrow, local view of the fields this page reads. */
interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  specifications: string;
  features: string;
  applications: string;
  image: string;
  galleryImages: string;
  brochure: string | null;
  priceDisplay: string;
  availability: string;
  featured: boolean;
  category: { name: string; slug: string };
}

/* `parseJson` used to be defined here. It moved to `lib/safe-json.ts` when the
   homepage showcase needed the same tolerance for admin-edited JSON columns —
   two copies of the function that decides whether bad data 500s a page would
   eventually disagree. Behaviour is unchanged. */

async function findProduct(slug: string): Promise<ProductRecord | null> {
  try {
    return (await prisma.product.findFirst({
      where: { OR: [{ slug }, { id: slug }], active: true },
      include: { category: true },
    })) as ProductRecord | null;
  } catch (error) {
    console.error("Product fetch error:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProduct(slug);

  if (!product) {
    return { title: "Product Not Found", robots: { index: false, follow: false } };
  }

  const canonical = `${SITE_URL}/products/${product.slug}`;

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const [config, product] = await Promise.all([getSiteConfig(), findProduct(slug)]);

  if (!product) notFound();

  const specs = parseJson<Record<string, string>>(product.specifications, {});
  const features = parseJson<string[]>(product.features, []);
  const applications = parseJson<string[]>(product.applications, []);
  const galleryImages = parseJson<string[]>(product.galleryImages, []);

  let relatedProducts: ProductRecord[] = [];
  try {
    relatedProducts = (await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, active: true },
      include: { category: true },
      take: 3,
    })) as ProductRecord[];
  } catch (error) {
    console.error("Related products fetch error:", error);
  }

  const waUrl = getWhatsAppLink(product.name, undefined, config.whatsappNumber);
  const cleanPhone = config.phonePrimary.split("[")[0].trim();
  const phoneUrl = `tel:${cleanPhone.replace(/[^\d+]/g, "")}`;
  const canonical = `${SITE_URL}/products/${product.slug}`;

  const availabilityUrl = (() => {
    const a = product.availability.toLowerCase();
    if (a.includes("out of stock")) return "https://schema.org/OutOfStock";
    if (a.includes("in stock")) return "https://schema.org/InStock";
    return "https://schema.org/PreOrder"; // "Made to Order", "Available"
  })();

  /**
   * Product structured data.
   *
   * Two fixes over the previous version:
   *   1. It was assembled into a `productSchema` const and then never rendered —
   *      no <script> tag existed anywhere in the JSX, so none of this reached
   *      search engines.
   *   2. `priceSpecification` emitted `"price": null` for every
   *      "Price on Request" item. A null price is invalid structured data;
   *      the correct signal is to omit price and let availability speak.
   */
  const numericPrice =
    product.priceDisplay && !/request/i.test(product.priceDisplay)
      ? Number.parseFloat(product.priceDisplay.replace(/[^\d.]/g, ""))
      : NaN;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.image, ...galleryImages].filter(Boolean),
    description: product.description,
    category: product.category.name,
    brand: { "@type": "Brand", name: config.businessName },
    manufacturer: { "@type": "Organization", name: config.businessName },
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "INR",
      availability: availabilityUrl,
      seller: { "@type": "Organization", name: config.businessName },
      ...(Number.isFinite(numericPrice) && numericPrice > 0
        ? { price: numericPrice }
        : {}),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category.name,
        item: `${SITE_URL}/products?category=${product.category.slug}`,
      },
      { "@type": "ListItem", position: 4, name: product.name, item: canonical },
    ],
  };

  return (
    <div className="shell py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[var(--text-subtle)]">
          <li>
            <Link href="/" className="transition-colors hover:text-[var(--accent)]">
              Home
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <li>
            <Link href="/products" className="transition-colors hover:text-[var(--accent)]">
              Products
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <li>
            <Link
              href={`/products?category=${encodeURIComponent(product.category.slug)}`}
              className="transition-colors hover:text-[var(--accent)]"
            >
              {product.category.name}
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <li aria-current="page" className="font-bold text-[var(--text)]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* ============ MACHINE HEADER ============ */}
      <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <ProductImageGallery
            productImage={product.image}
            galleryImages={galleryImages}
            productName={product.name}
          />
        </div>

        <div className="lg:col-span-6">
          <p className="eyebrow text-[var(--accent)]">{product.category.name}</p>

          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[var(--text)] sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-muted)]">
            {product.shortDescription}
          </p>

          {/* Commercial terms */}
          <dl className="mt-7 grid grid-cols-2 divide-x divide-[var(--border-inverse)] border border-[var(--border-inverse)] bg-[var(--surface-inverse)]">
            <div className="p-4">
              <dt className="spec-label text-[var(--text-inverse-muted)]">Pricing</dt>
              <dd className="mt-1 text-lg font-extrabold text-white">
                {product.priceDisplay}
              </dd>
            </div>
            <div className="p-4">
              <dt className="spec-label text-[var(--text-inverse-muted)]">Availability</dt>
              <dd className="mt-1 flex items-center gap-1.5 text-sm font-bold text-[var(--accent-on-dark-strong)]">
                <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {product.availability}
              </dd>
            </div>
          </dl>

          {/* Actions */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href={`/quote?product=${encodeURIComponent(product.name)}`}
              className="inline-flex rounded-[6px] items-center justify-center gap-2 bg-[var(--accent)] px-5 py-3.5 text-sm font-bold text-[var(--accent-fg)] transition-colors duration-200 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Request a quotation
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-[6px] items-center justify-center gap-2 border border-[var(--border-strong)] px-5 py-3.5 text-sm font-bold text-[var(--text)] transition-colors duration-200 hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Enquire on WhatsApp
            </a>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <a
              href={phoneUrl}
              className="inline-flex items-center gap-1.5 font-bold text-[var(--text)] underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--accent)]"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {cleanPhone}
            </a>
            <Link
              href="/contact"
              className="font-semibold text-[var(--text-muted)] underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
            >
              Discuss a non-standard specification
            </Link>
          </div>

          {product.brochure && (
            <a
              href={product.brochure}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center gap-3 border border-[var(--border)] bg-[var(--surface-2)] p-4 transition-colors duration-200 hover:border-[var(--border-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            >
              <FileText className="h-5 w-5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-[var(--text)]">
                  Product brochure (PDF)
                </span>
                <span className="block text-xs text-[var(--text-muted)]">
                  Specifications, features and applications for {product.name}
                </span>
              </span>
            </a>
          )}

          {/*
            Previously two badges read "Heavy Duty Structural Warranty" and
            "Direct Factory Spare Parts". The first asserted a specific warranty
            product that does not exist in any document on this site — the
            after-sales page correctly states that warranty terms are set out on
            the quotation. Replaced with what is actually true.
          */}
          <ul className="mt-6 grid grid-cols-1 gap-3 border-t border-[var(--border)] pt-5 text-xs text-[var(--text-muted)] sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
              <span>Warranty terms are confirmed in writing on your quotation</span>
            </li>
            <li className="flex items-start gap-2">
              <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
              <span>Spare parts supplied direct from our Mirzapur works</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ============ SPECIFICATIONS & DETAIL ============ */}
      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-7">
          <section aria-labelledby="construction-heading">
            <h2
              id="construction-heading"
              className="rule-tick text-xl font-bold tracking-tight text-[var(--text)]"
            >
              Construction &amp; description
            </h2>
            <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-[var(--text-muted)]">
              {product.description}
            </p>
          </section>

          {features.length > 0 && (
            <section aria-labelledby="features-heading">
              <h2
                id="features-heading"
                className="rule-tick text-xl font-bold tracking-tight text-[var(--text)]"
              >
                Engineering highlights
              </h2>
              <ul className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 py-3.5 text-sm text-[var(--text)]">
                    <CheckCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {applications.length > 0 && (
            <section aria-labelledby="applications-heading">
              <h2
                id="applications-heading"
                className="rule-tick text-xl font-bold tracking-tight text-[var(--text)]"
              >
                Suitable applications
              </h2>
              <ul className="mt-5 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2">
                {applications.map((app) => (
                  <li
                    key={app}
                    className="bg-[var(--surface-2)] p-4 text-xs font-bold text-[var(--text)]"
                  >
                    {app}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Spec sheet */}
        <div className="lg:col-span-5">
          <div className="panel sticky top-28 p-6">
            <h2 className="rule-tick text-lg font-bold tracking-tight text-[var(--text)]">
              Technical specifications
            </h2>

            {Object.keys(specs).length > 0 ? (
              <dl className="mt-5 divide-y divide-[var(--border)] border-t border-[var(--border)] text-xs">
                {Object.entries(specs).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-12 gap-3 py-3">
                    <dt className="col-span-5 spec-label text-[var(--text-subtle)]">{key}</dt>
                    <dd className="col-span-7 font-semibold text-[var(--text)]">{val}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-5 text-xs leading-relaxed text-[var(--text-muted)]">
                Specifications for this machine are set against your tractor and field
                requirement. Contact the works and we will confirm them in writing.
              </p>
            )}

            <p className="mt-5 border-t border-[var(--border)] pt-4 text-[11px] leading-relaxed text-[var(--text-subtle)]">
              Dimensions and capacities are indicative and may change as the machine is
              built to your specification. Final figures are stated on your quotation.
            </p>
          </div>
        </div>
      </div>

      {/* ============ RELATED ============ */}
      {relatedProducts.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="mt-16 border-t border-[var(--border)] pt-10"
        >
          <h2
            id="related-heading"
            className="text-xl font-bold tracking-tight text-[var(--text)]"
          >
            More in {product.category.name}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                id={rel.id}
                name={rel.name}
                slug={rel.slug}
                categoryName={rel.category.name}
                shortDescription={rel.shortDescription}
                image={rel.image}
                priceDisplay={rel.priceDisplay}
                availability={rel.availability}
                featured={rel.featured}
                brochure={rel.brochure ?? undefined}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
