"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BillListFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "all" | "Paid" | "Partially Paid" | "Unpaid";
  setStatusFilter: (val: "all" | "Paid" | "Partially Paid" | "Unpaid") => void;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillListFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dir,
  t,
}: BillListFiltersProps) {
  const renderStatusBadge = (status: string) => {
    if (status === "Paid") {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100">
          {t("paid")}
        </Badge>
      );
    }
    if (status === "Partially Paid") {
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100">
          {t("partially_paid")}
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100">
        {t("unpaid")}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs">
      <div className="relative col-span-2">
        <Search
          className={`absolute ${
            dir === "rtl" ? "right-3" : "left-3"
          } top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-555`}
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
          value={statusFilter}
          onValueChange={(val) =>
            setStatusFilter(
              (val as "all" | "Paid" | "Partially Paid" | "Unpaid") || "all"
            )
          }
        >
          <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
            <SelectValue
              placeholder={t("all_statuses", {
                defaultValue: "All Statuses",
              })}
            >
              {statusFilter === "all" ? (
                <span className="text-zinc-650 dark:text-zinc-400 font-medium">
                  {t("all_payment_statuses", {
                    defaultValue: "All Payment Statuses",
                  })}
                </span>
              ) : (
                renderStatusBadge(statusFilter)
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <SelectItem value="all">
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                {t("all_payment_statuses", {
                  defaultValue: "All Payment Statuses",
                })}
              </span>
            </SelectItem>
            <SelectItem value="Paid">{renderStatusBadge("Paid")}</SelectItem>
            <SelectItem value="Partially Paid">
              {renderStatusBadge("Partially Paid")}
            </SelectItem>
            <SelectItem value="Unpaid">{renderStatusBadge("Unpaid")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
