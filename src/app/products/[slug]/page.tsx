import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  CheckCircle,
  Shield,
  MessageSquare,
  FileText,
  ChevronRight,
  Wrench,
  Tag,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { getSiteConfig } from "@/lib/site-settings";

export const revalidate = 30;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ slug: slug }, { id: slug }] },
    include: { category: true },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | M/s Raj Agro Engineering Works`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const config = await getSiteConfig();

  const product = await prisma.product.findFirst({
    where: { OR: [{ slug: slug }, { id: slug }] },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  // Parse specifications, features, applications, gallery
  let specs: Record<string, string> = {};
  let features: string[] = [];
  let applications: string[] = [];
  let galleryImages: string[] = [];

  try {
    specs = JSON.parse(product.specifications || "{}");
  } catch (e) {
    specs = {};
  }

  try {
    features = JSON.parse(product.features || "[]");
  } catch (e) {
    features = [];
  }

  try {
    applications = JSON.parse(product.applications || "[]");
  } catch (e) {
    applications = [];
  }

  try {
    galleryImages = JSON.parse(product.galleryImages || "[]");
  } catch (e) {
    galleryImages = [];
  }

  // Fetch related products in same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      active: true,
    },
    include: { category: true },
    take: 3,
  });

  const waUrl = getWhatsAppLink(product.name, undefined, config.whatsappNumber);

  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-gray-500">
        <Link href="/" className="hover:text-emerald-800">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-emerald-800">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-emerald-800">
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-16/11 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {product.featured && (
              <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-extrabold text-xs uppercase px-3 py-1 rounded-md shadow-xs">
                Featured Machine
              </span>
            )}
          </div>

          {/* Secondary Thumbnail Strip */}
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-emerald-700">
                <Image src={product.image} alt="Thumbnail main" fill className="object-cover" />
              </div>
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Key Details & Purchase CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              <span>{product.category.name}</span>
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            <p className="text-sm text-gray-600 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Pricing & Availability Card */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">
                Pricing Notice
              </span>
              <span className="text-lg font-extrabold text-amber-400">
                {product.priceDisplay}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">
                Availability
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center justify-end space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{product.availability}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={`/quote?product=${encodeURIComponent(product.name)}`}
                className="w-full inline-flex items-center justify-center py-3 px-4 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm transition-all"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span>Request Quotation</span>
              </Link>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center py-3 px-4 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>

            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span>Contact Sales Team for Custom Specifications</span>
            </Link>
          </div>

          {/* Key Assurance Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-600 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Heavy Duty Structural Warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Direct Factory Spare Parts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Detailed Specs & Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Detailed Description & Features */}
        <div className="lg:col-span-7 space-y-8">
          {/* Detailed Narrative */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-gray-100 pb-3">
              Machine Description & Construction
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Key Features Checklist */}
          {features.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-gray-100 pb-3">
                Key Engineering Highlights
              </h3>
              <div className="space-y-3">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm text-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applications */}
          {applications.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-gray-100 pb-3">
                Suitable Farm & Industry Applications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {applications.map((app, idx) => (
                  <div key={idx} className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs font-semibold text-emerald-950">
                    {app}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Specifications Table Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 border-b border-gray-100 pb-3">
              Technical Specifications
            </h3>

            {Object.keys(specs).length > 0 ? (
              <div className="divide-y divide-gray-100 text-xs">
                {Object.entries(specs).map(([key, val]) => (
                  <div key={key} className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-5 font-bold text-gray-600">{key}</span>
                    <span className="col-span-7 font-medium text-slate-900">{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">Contact factory for custom technical specifications.</p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-gray-200 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            Related Machinery in {product.category.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
