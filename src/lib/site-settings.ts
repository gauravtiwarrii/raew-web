import { prisma } from "@/lib/db";
import { DEFAULT_SITE_CONFIG, SiteConfig } from "@/lib/config";

type SettingLike = {
  key: string;
  value: string;
};

function toCamelSettingKey(key: string) {
  return key.toLowerCase().replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

export function applySiteSettings(settings: SettingLike[], base: SiteConfig = DEFAULT_SITE_CONFIG) {
  const configMap: Record<string, string> = { ...base };

  for (const item of settings) {
    if (!item.value) continue;
    configMap[item.key] = item.value;
    configMap[toCamelSettingKey(item.key)] = item.value;
  }

  return configMap as unknown as SiteConfig & Record<string, string>;
}

export async function getSiteConfig() {
  try {
    const dbSettings = await prisma.siteSetting.findMany();
    return applySiteSettings(dbSettings);
  } catch {
    return DEFAULT_SITE_CONFIG as SiteConfig & Record<string, string>;
  }
}

export function isPlaceholderValue(value?: string) {
  return !value || value.includes("[REPLACE");
}
