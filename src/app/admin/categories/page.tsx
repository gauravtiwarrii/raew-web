import { prisma } from "@/lib/db";
import CategoryManager from "./CategoryManager";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return <CategoryManager initialCategories={categories} />;
}
