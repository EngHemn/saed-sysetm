"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider, Language } from "./language-provider";

export function Providers({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: Language;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider defaultLanguage={lang}>{children}</LanguageProvider>
    </QueryClientProvider>
  );
}
