"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NoteListFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function NoteListFilters({
  searchQuery,
  setSearchQuery,
  dir,
  t,
}: NoteListFiltersProps) {
  return (
    <div className="flex items-center gap-4 dark:bg-zinc-950 p-1 rounded-xl">
      <div className="relative flex-1 max-w-md">
        <Search
          className={`absolute ${
            dir === "rtl" ? "right-3" : "left-3"
          } top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500 pointer-events-none`}
        />
        <Input
          placeholder={t("search_placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${
            dir === "rtl" ? "pr-9 pl-3" : "pl-9 pr-3"
          } bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 text-start`}
        />
      </div>
    </div>
  );
}
