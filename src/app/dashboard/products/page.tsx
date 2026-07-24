"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/presentation/components/theme-toggle";
import { ProductListScreen } from "@/presentation/screens/ProductListScreen";

export default function ProductsPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/10">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 px-6 bg-white dark:bg-zinc-950 shadow-xs">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Product Management
          </h2>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <ProductListScreen />
        </div>
      </main>
    </div>
  );
}
