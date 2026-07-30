"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CategoryListFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function CategoryListFilters({
  searchQuery,
  setSearchQuery,
  dir,
  t,
}: CategoryListFiltersProps) {
  return (
    <div className="flex items-center gap-4 dark:bg-zinc-950 p-1 rounded-xl">
      <div className="relative flex-1 max-w-md">
        <Search
          className={`absolute ${dir === "rtl" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-550`}
        />
        <Input
          placeholder={t("search_placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${dir === "rtl" ? "pr-9" : "pl-9"} bg-white`}
        />
      </div>
    </div>
  );
}
