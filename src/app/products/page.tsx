import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/db";

const fallbackProducts = [
  { slug: "multi-speed-rotavator", category: "Soil preparation", name: "Multi-Speed Rotavator", image: "/visuals/machine.jpg" },
  { slug: "laser-land-leveller", category: "Field precision", name: "Laser Land Leveller", image: "/visuals/field.jpg" },
  { slug: "multi-crop-thresher", category: "Crop processing", name: "Multi-Crop Thresher", image: "/visuals/detail.jpg" },
];

export default async function ProductsPage() {
  let products = fallbackProducts;
  try {
    const records = await prisma.product.findMany({ where: { active: true }, include: { category: true }, orderBy: { createdAt: "desc" } });
    if (records.length) products = records.map((product) => ({ slug: product.slug, category: product.category.name, name: product.name, image: product.image || fallbackProducts[0].image }));
  } catch (error) { console.error("Catalogue fetch error:", error); }

  return <main className="catalogue-page"><section className="catalogue-intro"><div className="shell"><p className="eyebrow">Catalogue / 01</p><h1>The right machine<br /><i>changes the work.</i></h1><p>Explore field-ready platforms or bring us a requirement that needs a different answer.</p></div></section><section className="catalogue-grid-section"><div className="shell catalogue-grid">{products.map((product, index) => <Link href={`/products/${product.slug}`} className="catalogue-card" key={product.slug}><div><Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 100vw, 50vw" className="cover-image" /><span>{String(index + 1).padStart(2, "0")}</span></div><p className="eyebrow">{product.category}</p><h2>{product.name}</h2><ArrowUpRight size={20} /></Link>)}<Link href="/quote" className="catalogue-card catalogue-custom"><div><span>+</span><p>Custom engineering</p></div><p className="eyebrow">Can&apos;t find it?</p><h2>Built around your brief</h2><ArrowUpRight size={20} /></Link></div></section></main>;
}
