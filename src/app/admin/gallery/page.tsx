import { prisma } from "@/lib/db";
import GalleryManager from "./GalleryManager";

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <GalleryManager initialItems={items} />;
}
