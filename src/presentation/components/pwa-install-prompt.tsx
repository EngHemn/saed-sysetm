"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Inline SVGs for Safari iOS icons to ensure reliable rendering without version mismatches
const SafariShareIcon = () => (
  <svg
    className="w-5 h-5 text-blue-500 inline-block mx-1 align-middle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const AddToHomeScreenIcon = () => (
  <svg
    className="w-5 h-5 text-foreground inline-block mx-1 align-middle border border-muted-foreground/30 rounded bg-muted/20 p-0.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(true); // Start dismissed until checked in useEffect
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Check if already dismissed
      const dismissed = localStorage.getItem("pwa-prompt-dismissed") === "true";
      setIsDismissed(dismissed);

      // 2. Check if running in standalone mode
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isStandaloneMode);

      // 3. Detect iOS Device
      const userAgent = window.navigator.userAgent;
      const isIosDevice =
        /iPad|iPhone|iPod/.test(userAgent) ||
        (/Macintosh/.test(userAgent) && "ontouchend" in document);
      setIsIos(isIosDevice);

      // 4. Handle Android/Chrome beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      const handleAppInstalled = () => {
        setDeferredPrompt(null);
        console.log("[PWA] App successfully installed");
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      // 5. Delay showing prompt for premium micro-interaction feel (3s)
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
        clearTimeout(timer);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("[PWA] User accepted install prompt");
    } else {
      console.log("[PWA] User dismissed install prompt");
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  // Render nothing if standalone, dismissed, or initial loading delay is active
  if (isStandalone || isDismissed || !showPrompt) {
    return null;
  }

  // iOS-specific instructions banner
  if (isIos) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-sm w-[calc(100vw-2rem)] bg-card text-card-foreground border border-amber-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 flex-shrink-0 animate-pulse">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-tight">Install Saed System</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add to your home screen for full offline dashboard access.
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 text-xs space-y-2.5 text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 font-medium text-[10px]">1</span>
            <span>
              Tap the Safari Share button <SafariShareIcon />.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 font-medium text-[10px]">2</span>
            <span>
              Scroll down and tap <span className="font-medium text-foreground">Add to Home Screen</span> <AddToHomeScreenIcon />.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Non-iOS prompt (Android/Chrome/etc. using deferred prompt)
  if (!deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-sm w-[calc(100vw-2rem)] bg-card text-card-foreground border border-amber-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 flex-shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-tight">Install Saed System</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add to home screen for fast offline dashboard access.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md cursor-pointer"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          id="pwa-install-button"
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Install App
        </button>

        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer"
        >
          Not Now
        </button>
      </div>
    </div>
  );
}
