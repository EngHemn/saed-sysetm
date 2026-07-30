"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/domain/entities/Category";

interface ProductListFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (val: string) => void;
  selectedBrandFilter: string;
  setSelectedBrandFilter: (val: string) => void;
  selectedAlertFilter: "all" | "alert" | "no_alert";
  setSelectedAlertFilter: (val: "all" | "alert" | "no_alert") => void;
  categories: Category[];
  brandOptions: (string | null)[];
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function ProductListFilters({
  searchQuery,
  setSearchQuery,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  selectedBrandFilter,
  setSelectedBrandFilter,
  selectedAlertFilter,
  setSelectedAlertFilter,
  categories,
  brandOptions,
  dir,
  t,
}: ProductListFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs">
      <div className="relative col-span-1">
        <Search
          className={`absolute ${dir === "rtl" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-555`}
        />
        <Input
          placeholder={t("search_placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${dir === "rtl" ? "pr-9" : "pl-9"} bg-white`}
        />
      </div>

      <div>
        <Select
          value={selectedCategoryFilter}
          onValueChange={(val) => {
            setSelectedCategoryFilter(val || "all");
            setSelectedBrandFilter("all");
          }}
        >
          <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
            <SelectValue placeholder={t("all_categories")}>
              {selectedCategoryFilter === "all"
                ? t("all_categories")
                : categories.find((c) => c.id === selectedCategoryFilter)?.title}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800">
            <SelectItem value="all">{t("all_categories")}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Select
          value={selectedBrandFilter}
          onValueChange={(val) => setSelectedBrandFilter(val || "all")}
        >
          <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
            <SelectValue placeholder={t("all_brands")}>
              {selectedBrandFilter === "all"
                ? t("all_brands")
                : selectedBrandFilter}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800">
            <SelectItem value="all">{t("all_brands")}</SelectItem>
            {brandOptions.map((brand, idx) => (
              <SelectItem key={idx} value={brand || ""}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Select
          value={selectedAlertFilter}
          onValueChange={(val) =>
            setSelectedAlertFilter(
              (val as "all" | "alert" | "no_alert") || "all"
            )
          }
        >
          <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
            <SelectValue placeholder={t("all_alerts")}>
              {selectedAlertFilter === "all"
                ? t("all_alerts")
                : selectedAlertFilter === "alert"
                ? t("with_alert")
                : t("without_alert")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800">
            <SelectItem value="all">{t("all_alerts")}</SelectItem>
            <SelectItem value="alert">{t("with_alert")}</SelectItem>
            <SelectItem value="no_alert">{t("without_alert")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
