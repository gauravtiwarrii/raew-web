import QuoteClient from "./QuoteClient";
import { prisma } from "@/lib/db";
import { getSiteConfig } from "@/lib/site-settings";

export const metadata = {
  title: "Request a Machinery Quotation",
  description: "Get an official price quote for rotavators, laser land levelers, threshers, tractor trailers, and custom farm machinery from M/s Raj Agro Engineering Works.",
};

export const revalidate = 60;

interface QuotePageProps {
  searchParams: Promise<{
    product?: string;
  }>;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const params = await searchParams;
  const config = await getSiteConfig();
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <QuoteClient
      products={products}
      initialProductTitle={params.product || ""}
      whatsappNumber={config.whatsappNumber}
    />
  );
}
