"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Default language
const defaultLang = "en";

// Language context
const LanguageContext = createContext({
  lang: defaultLang,
  t: (key: string) => key,
  setLang: (lang: string) => {},
});

// Language provider
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState(defaultLang);

  // Load translations from JSON files
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // Load translation file for current language
    async function loadTranslations() {
      try {
        const module = await import(`@/lib/translations/${lang}.json`);
        setTranslations(module.default);
      } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
        // Fallback to English if language file not found
        if (lang !== "en") {
          setLang("en");
        }
      }
    }

    loadTranslations();
  }, [lang]);

  // Translation function
  const t = (key: string): string => {
    // Support nested keys like "nav.home"
    const keys = key.split(".");
    let result = translations;

    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = (result as any)[k];
      } else {
        // Return the key itself if translation not found
        return key;
      }
    }

    return typeof result === "string" ? result : key;
  };

  // Update html lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
  }, [lang]);

  const value = {
    lang,
    t,
    setLang,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}