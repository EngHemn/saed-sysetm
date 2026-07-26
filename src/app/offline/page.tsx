"use client";

import Link from "next/link";
import { WifiOff, RefreshCw, LayoutDashboard } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 text-center">
      <div className="relative mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-muted/30 border border-amber-500/30 text-amber-500 animate-pulse">
        <WifiOff className="w-12 h-12" />
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-2">
        You are offline
      </h1>

      <p className="text-muted-foreground max-w-md mb-8 text-sm leading-relaxed">
        Saed System could not reach the server. Don&apos;t worry, previously visited dashboard pages remain accessible offline!
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Reconnecting
        </button>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-muted text-muted-foreground font-medium text-sm hover:bg-muted/80 hover:text-foreground transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
