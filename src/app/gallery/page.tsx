import { prisma } from "@/lib/db";
import GalleryClient from "./GalleryClient";

export const metadata = {
  title: "Workshop & Machinery Gallery",
  description: "View photographs of M/s Raj Agro Engineering Works plant, manufacturing infrastructure, rotary tillers, thresher builds, and field demonstrations.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  let items: any[] = [];
  try {
    items = await prisma.galleryItem.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Gallery page data fetch error:", error);
  }

  return <GalleryClient initialItems={items} />;
}
