import { prisma } from "@/lib/db";
import EnquiryManager from "./EnquiryManager";

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return <EnquiryManager initialEnquiries={enquiries} />;
}
