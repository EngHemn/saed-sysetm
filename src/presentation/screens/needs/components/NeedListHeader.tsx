"use client";

import React from "react";
import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NeedListHeaderProps {
  activeTab: string;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function NeedListHeader({ activeTab, t }: NeedListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-900/5 dark:bg-white/5 text-zinc-655 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50 mb-1.5">
          <ClipboardList className="h-3 w-3 text-zinc-500 shrink-0" />
          <span>
            {t("store_operations", { defaultValue: "Store Operations" })}
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-955 dark:text-zinc-550 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent text-start">
          {t("need_management")}
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 text-start">
          {t("need_management_desc", {
            defaultValue:
              "Optimize your inventory by managing needed items and processing product action alerts.",
          })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {activeTab === "needs" && (
          <Link
            href="/dashboard/needs/add?tab=needs-management"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-955 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-1.5 px-4 py-2 h-9 rounded-lg shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 font-semibold text-xs cursor-pointer"
            )}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {t("add_need")}
          </Link>
        )}
      </div>
    </div>
  );
}
