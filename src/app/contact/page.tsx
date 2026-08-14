import ContactClient from "./ContactClient";
import { getSiteConfig } from "@/lib/site-settings";

export const metadata = {
  title: "Contact Us",
  description: "Contact M/s Raj Agro Engineering Works - Phone, WhatsApp, factory address, business hours, and interactive enquiry form.",
};

export default async function ContactPage() {
  const config = await getSiteConfig();
  return <ContactClient config={config} />;
}
