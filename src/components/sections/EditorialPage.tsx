import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MoveRight } from "lucide-react";

interface EditorialPageProps {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  image: string;
  imageAlt: string;
  sections: Array<{ title: string; body: string }>;
  cta?: { label: string; href: string };
}

export default function EditorialPage({ eyebrow, title, accent, intro, image, imageAlt, sections, cta = { label: "Start a conversation", href: "/quote" } }: EditorialPageProps) {
  return <main className="editorial-page"><section className="editorial-hero"><div className="shell editorial-hero-grid"><div><p className="eyebrow">{eyebrow}</p><h1>{title}<i>{accent}</i></h1><p>{intro}</p><Link href={cta.href} className="dark-pill">{cta.label} <ArrowUpRight size={16} /></Link></div><div className="editorial-hero-image"><Image src={image} alt={imageAlt} fill sizes="(max-width: 800px) 100vw, 50vw" className="cover-image" /></div></div></section><section className="editorial-body"><div className="shell editorial-body-grid"><p className="eyebrow">The details matter</p><div>{sections.map((section, index) => <article key={section.title}><span>0{index + 1}</span><div><h2>{section.title}</h2><p>{section.body}</p></div><MoveRight size={18} /></article>)}</div></div></section></main>;
}
