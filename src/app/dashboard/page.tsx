"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { menuItems } from "@/presentation/components/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/presentation/components/theme-toggle";

function DashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "product-management";
  const activeItem = menuItems.find((item) => item.id === activeTab) || menuItems[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50 dark:bg-zinc-900/40">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 px-6 bg-white dark:bg-zinc-950 shadow-xs">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {activeItem.title}
          </h2>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
          <Card className="w-full max-w-2xl border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm py-16 px-8 text-center">
            <CardContent className="space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <activeItem.icon className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {activeItem.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  This page currently does not have any content. Navigate using the options in the left sidebar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/40">
        <div className="animate-pulse text-lg text-zinc-500 dark:text-zinc-400">Loading...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
