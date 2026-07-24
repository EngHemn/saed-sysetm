import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saed System | Dashboard",
  description: "Management dashboard system for Saed System operations.",
  keywords: [
    "Saed",
    "System",
    "Dashboard",
    "Management",
    "Bill",
    "Product",
    "Category",
  ],
  openGraph: {
    title: "Saed System | Dashboard",
    description: "Management dashboard system for Saed System operations.",
    type: "website",
    locale: "en_US",
  },
};

import { ThemeProvider } from "@/presentation/components/theme-provider";
import { Providers } from "@/presentation/components/providers";

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className="h-full scroll-smooth"
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] overflow-x-hidden bg-background text-foreground antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
