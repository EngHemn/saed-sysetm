"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompanyListPaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  total: number;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function CompanyListPagination({
  page,
  setPage,
  totalPages,
  total,
  t,
}: CompanyListPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/20 dark:bg-zinc-900/5 mt-6 rounded-xl">
      <div className="text-zinc-400 dark:text-zinc-500">
        {t("total")}: {total}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 rounded-lg text-xs"
        >
          {t("previous")}
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
          <Button
            key={i}
            variant={page === i ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(i)}
            className={cn(
              "h-8 w-8 p-0 rounded-lg font-bold text-xs",
              page === i
                ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-955"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50"
            )}
          >
            {i}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || total === 0}
          className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 rounded-lg text-xs"
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
}
