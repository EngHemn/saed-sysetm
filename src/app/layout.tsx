import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/presentation/components/theme-provider";
import { Providers } from "@/presentation/components/providers";
import { PwaRegister } from "@/presentation/components/pwa-register";
import { PwaInstallPrompt } from "@/presentation/components/pwa-install-prompt";

export const metadata: Metadata = {
  title: "Saed System | Dashboard",
  description: "Management dashboard system for Saed System operations.",
  applicationName: "Saed System",
  keywords: [
    "Saed",
    "System",
    "Dashboard",
    "Management",
    "Bill",
    "Product",
    "Category",
    "PWA",
  ],
  authors: [{ name: "Saed System Team" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Saed System",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/icons/icon-192x192.png"],
  },
  openGraph: {
    title: "Saed System | Dashboard",
    description: "Management dashboard system for Saed System operations.",
    type: "website",
    locale: "en_US",
    siteName: "Saed System",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
          <Providers>
            {children}
            <PwaRegister />
            <PwaInstallPrompt />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

