"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 px-6 bg-white dark:bg-zinc-950 shadow-xs">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
