import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, MoveRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/safe-json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in";
async function getProduct(slug: string) { return prisma.product.findFirst({ where: { OR: [{ slug }, { id: slug }], active: true }, include: { category: true } }); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const product = await getProduct((await params).slug); return product ? { title: product.name, description: product.shortDescription, alternates: { canonical: `${siteUrl}/products/${product.slug}` } } : { title: "Product not found", robots: { index: false } }; }

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const specs = parseJson<Record<string, string>>(product.specifications, {});
  const features = parseJson<string[]>(product.features, []);
  const applications = parseJson<string[]>(product.applications, []);
  const gallery = parseJson<string[]>(product.galleryImages, []);
  const images = [product.image || "/visuals/machine.jpg", ...gallery].filter(Boolean);
  return <main className="product-detail-page"><section className="product-detail-hero"><div className="shell product-detail-grid"><div className="product-detail-image"><Image src={images[0]} alt={product.name} fill priority sizes="(max-width: 800px) 100vw, 55vw" className="cover-image" /></div><div><p className="eyebrow light">{product.category.name}</p><h1>{product.name}</h1><p className="product-lede">{product.shortDescription}</p><div className="detail-actions"><Link href="/quote" className="glass-button">Request a quote <ArrowUpRight size={16} /></Link><Link href="/contact" className="quiet-link">Talk to engineering <MoveRight size={16} /></Link></div><div className="detail-status"><span>{product.priceDisplay}</span><span>{product.availability}</span></div></div></div></section><section className="product-detail-body"><div className="shell detail-content"><div><p className="eyebrow">The machine</p><h2>Built for the work<br /><i>ahead.</i></h2></div><div><p className="detail-description">{product.description}</p>{Object.keys(specs).length > 0 && <dl className="spec-list">{Object.entries(specs).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>}</div></div></section>{(features.length > 0 || applications.length > 0) && <section className="detail-lists"><div className="shell detail-lists-grid">{features.length > 0 && <div><p className="eyebrow">Features</p><ul>{features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul></div>}{applications.length > 0 && <div><p className="eyebrow">Applications</p><ul>{applications.map((application) => <li key={application}><Check size={16} />{application}</li>)}</ul></div>}</div></section>}</main>;
}
