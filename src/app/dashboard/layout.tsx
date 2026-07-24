"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/presentation/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        <React.Suspense fallback={
          <div className="w-[270px] border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950" />
        }>
          <DashboardSidebar />
        </React.Suspense>
        <SidebarInset className="flex flex-col flex-1 bg-background overflow-hidden">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

