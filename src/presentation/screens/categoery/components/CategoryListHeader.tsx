"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryListHeaderProps {
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function CategoryListHeader({ t }: CategoryListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("categories")}
        </h1>
        <p className="text-sm text-zinc-550 dark:text-zinc-400">
          {t("categories_subtitle")}
        </p>
      </div>
      <Link
        href="/dashboard/categories/add?tab=category-management"
        className={cn(
          buttonVariants({ variant: "default" }),
          "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-2",
        )}
      >
        <Plus className="h-4 w-4" />
        {t("add_category")}
      </Link>
    </div>
  );
}
