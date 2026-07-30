"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompanyListHeaderProps {
  onAddClick: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function CompanyListHeader({ onAddClick, t }: CompanyListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-955 dark:text-zinc-50">
          {t("company_management")}
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1">
          {t("companies_subtitle")}
        </p>
      </div>

      <Button
        onClick={onAddClick}
        className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-1.5 px-4 h-9 rounded-lg font-semibold text-xs transition-all duration-200 shadow-sm"
      >
        <Plus className="h-4 w-4" />
        {t("add_company")}
      </Button>
    </div>
  );
}
