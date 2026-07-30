"use client";

import React from "react";
import Link from "next/link";
import { Plus, RefreshCw, List, LayoutGrid } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BillListHeaderProps {
  refetch: () => void;
  viewMode: "list" | "card";
  setViewMode: (mode: "list" | "card") => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillListHeader({
  refetch,
  viewMode,
  setViewMode,
  t,
}: BillListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("bill_management")}
        </h1>
        <p className="text-sm text-zinc-555 dark:text-zinc-400">
          {t("bills_subtitle")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  className="border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>
              <p>{t("refresh", { defaultValue: "Refresh List" })}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-50 dark:bg-zinc-900/30">
            <Button
              type="button"
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-md p-0 cursor-pointer",
                viewMode === "list" && "bg-white dark:bg-zinc-800 shadow-xs"
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
            </Button>
            <Button
              type="button"
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-md p-0 cursor-pointer",
                viewMode === "card" && "bg-white dark:bg-zinc-800 shadow-xs"
              )}
              onClick={() => setViewMode("card")}
            >
              <LayoutGrid className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
            </Button>
          </div>
          <Link
            href="/dashboard/bills/add?tab=bill-management"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-955 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-2"
            )}
          >
            <Plus className="h-4 w-4" />
            {t("add_bill")}
          </Link>
        </div>
      </div>
    </div>
  );
}
