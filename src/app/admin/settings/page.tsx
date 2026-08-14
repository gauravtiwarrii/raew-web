import { prisma } from "@/lib/db";
import SettingsManager from "./SettingsManager";
import { applySiteSettings } from "@/lib/site-settings";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const dbSettings = await prisma.siteSetting.findMany();
  return <SettingsManager initialConfig={applySiteSettings(dbSettings)} />;
}
