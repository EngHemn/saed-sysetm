"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ProductListPaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  perPage: number;
  setPerPage: (perPage: number) => void;
  total: number;
  viewMode: "list" | "card";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function ProductListPagination({
  page,
  setPage,
  perPage,
  setPerPage,
  total,
  viewMode,
  t,
}: ProductListPaginationProps) {
  const totalPages = Math.ceil(total / perPage);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-zinc-50/20 dark:bg-zinc-900/5",
        viewMode === "list"
          ? "border-t border-zinc-200 dark:border-zinc-800"
          : "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-550 dark:text-zinc-400">
          {t("show")}
        </span>
        <Select
          value={perPage.toString()}
          onValueChange={(val) => {
            setPerPage(parseInt(val || "10", 10));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[80px] h-8 bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800">
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-zinc-550 dark:text-zinc-400">
          {t("items_per_page")} ({t("total")}: {total})
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50"
        >
          {t("previous")}
        </Button>
        {(() => {
          const buttons = [];
          for (let i = 1; i <= totalPages; i++) {
            if (
              i === 1 ||
              i === totalPages ||
              (i >= page - 1 && i <= page + 1)
            ) {
              buttons.push(
                <Button
                  key={i}
                  variant={page === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(i)}
                  className={cn(
                    "h-8 w-8 p-0",
                    page === i
                      ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50"
                  )}
                >
                  {i}
                </Button>
              );
            } else if (i === page - 2 || i === page + 2) {
              buttons.push(
                <span key={`dots-${i}`} className="px-1 text-zinc-450">
                  ...
                </span>
              );
            }
          }
          return buttons;
        })()}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={page === totalPages || total === 0}
          className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50"
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
}
