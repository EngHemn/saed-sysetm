"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CompanyListFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function CompanyListFilters({
  searchQuery,
  setSearchQuery,
  dir,
  t,
}: CompanyListFiltersProps) {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 backdrop-blur-md max-w-md">
      <div className="relative flex-1">
        <Search
          className={`absolute ${dir === "rtl" ? "right-2.5" : "left-2.5"} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500`}
        />
        <Input
          placeholder={t("search_placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${dir === "rtl" ? "pr-8.5" : "pl-8.5"} h-9 bg-white dark:bg-zinc-955/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 rounded-lg text-xs`}
        />
      </div>
    </div>
  );
}
