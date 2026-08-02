"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface NeedListFiltersProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priorityFilter: string;
  setPriorityFilter: (filter: string) => void;
  setPage: (page: number) => void;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function NeedListFilters({
  activeTab,
  handleTabChange,
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  setPage,
  dir,
  t,
}: NeedListFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 rounded-xl bg-zinc-150/40 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 backdrop-blur-md">
      <div className="flex bg-zinc-100 dark:bg-zinc-955 p-1 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 w-fit">
        {["products", "needs"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={cn(
              "relative px-4 py-1.5 rounded-md text-[11px] font-bold capitalize transition-all duration-300 cursor-pointer",
              activeTab === tab
                ? "bg-white dark:bg-zinc-900 text-zinc-955 dark:text-zinc-50 shadow-xs border border-zinc-200/50 dark:border-zinc-800/50"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            )}
          >
            {tab === "products"
              ? t("alerted_products", { defaultValue: "Alerted Products" })
              : t("stored_needs", { defaultValue: "Stored Needs" })}
          </button>
        ))}
      </div>

      <div className="flex flex-1 items-center gap-2 max-w-sm w-full ml-auto">
        <div className="relative flex-1">
          <Search
            className={`absolute ${
              dir === "rtl" ? "right-2.5" : "left-2.5"
            } top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 dark:text-zinc-550 pointer-events-none`}
          />
          <Input
            placeholder={
              activeTab === "products"
                ? t("search_alerted_products", {
                    defaultValue: "Search alerted products...",
                  })
                : t("search_needs", { defaultValue: "Search needs..." })
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${
              dir === "rtl" ? "pr-8.5 pl-3" : "pl-8.5 pr-3"
            } h-9 bg-white dark:bg-zinc-955/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 rounded-lg text-xs text-start`}
          />
        </div>

        {activeTab === "needs" && (
          <div className="w-[120px] shrink-0">
            <Select
              value={priorityFilter}
              onValueChange={(val) => {
                setPriorityFilter(val || "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 bg-white dark:bg-zinc-955/50 border-zinc-200 dark:border-zinc-800 rounded-lg text-xs">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Filter className="h-3 w-3 shrink-0" />
                  <SelectValue placeholder={t("priority")} />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="Low">{t("low")}</SelectItem>
                <SelectItem value="Medium">{t("medium")}</SelectItem>
                <SelectItem value="High">{t("high")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}

