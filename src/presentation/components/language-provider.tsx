"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/presentation/translations/translations";

export type Language = "en" | "ku";

interface LanguageContextType {
  language: Language;
  dir: "ltr" | "rtl";
  setLanguage: (lang: Language) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({
  children,
  defaultLanguage = "en",
}: {
  children: React.ReactNode;
  defaultLanguage?: Language;
}) {
  const router = useRouter();
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as Language;
    if (savedLang === "en" || savedLang === "ku") {
      setLanguageState(savedLang);
    } else {
      const cookies = document.cookie.split(";");
      const langCookie = cookies.find((c) => c.trim().startsWith("app_lang="));
      if (langCookie) {
        const langValue = langCookie.split("=")[1].trim() as Language;
        if (langValue === "en" || langValue === "ku") {
          setLanguageState(langValue);
        }
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_lang", lang);
    document.cookie = `app_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  const dir = language === "ku" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    if (language === "ku") {
      document.documentElement.classList.add("rtl");
      document.documentElement.classList.remove("ltr");
    } else {
      document.documentElement.classList.add("ltr");
      document.documentElement.classList.remove("rtl");
    }
  }, [language, dir]);

  const t = (key: string, values?: Record<string, string | number>) => {
    const dict = translations[language] as Record<string, string>;
    let translation =
      dict[key] ||
      translations["en"][key as keyof (typeof translations)["en"]] ||
      key;

    if (values) {
      Object.entries(values).forEach(([k, v]) => {
        translation = translation.replace(`{${k}}`, String(v));
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, dir, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
