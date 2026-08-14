import { prisma } from "@/lib/db";
import ProductManager from "./ProductManager";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return <ProductManager initialProducts={products} categories={categories} />;
}
