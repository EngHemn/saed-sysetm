"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ProductInfoItem {
  title: string;
  description: string;
}

interface ProductFormSpecsSectionProps {
  infoList: ProductInfoItem[];
  infoTitle: string;
  setInfoTitle: (val: string) => void;
  infoDescription: string;
  setInfoDescription: (val: string) => void;
  addInfoItem: () => void;
  removeInfoItem: (index: number) => void;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function ProductFormSpecsSection({
  infoList,
  infoTitle,
  setInfoTitle,
  infoDescription,
  setInfoDescription,
  addInfoItem,
  removeInfoItem,
  dir,
  t,
}: ProductFormSpecsSectionProps) {
  return (
    <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-900 pt-4">
      <Label className="text-zinc-900 dark:text-zinc-300 font-semibold text-start block">
        {t("specifications")}
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-zinc-700 dark:text-zinc-400 text-xs font-semibold block text-start">
            {t("title", { defaultValue: "Title" })}
          </Label>
          <Input
            placeholder={t("title", { defaultValue: "Title" })}
            value={infoTitle}
            onChange={(e) => setInfoTitle(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-start"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-700 dark:text-zinc-400 text-xs font-semibold block text-start">
            {t("description", { defaultValue: "Description" })}
          </Label>
          <Input
            placeholder={t("description", { defaultValue: "Description" })}
            value={infoDescription}
            onChange={(e) => setInfoDescription(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-start"
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button
          type="button"
          onClick={addInfoItem}
          variant="outline"
          className="border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50"
        >
          {t("add")}
        </Button>
      </div>

      {infoList.length > 0 && (
        <div
          className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/10"
          dir={dir}
        >
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-900/30">
              <tr>
                <th
                  className={`px-4 py-2 ${
                    dir === "rtl" ? "text-right" : "text-start"
                  } text-xs font-medium text-zinc-500 uppercase tracking-wider`}
                >
                  {t("title", { defaultValue: "Title" })}
                </th>
                <th
                  className={`px-4 py-2 ${
                    dir === "rtl" ? "text-right" : "text-start"
                  } text-xs font-medium text-zinc-500 uppercase tracking-wider`}
                >
                  {t("description")}
                </th>
                <th
                  className={`px-4 py-2 ${
                    dir === "rtl" ? "text-start" : "text-right"
                  } text-xs font-medium text-zinc-500 uppercase tracking-wider w-16`}
                >
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-955">
              {infoList.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-150 text-start">
                    {item.title}
                  </td>
                  <td className="px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400 text-start">
                    {item.description}
                  </td>
                  <td
                    className={`px-4 py-2 ${
                      dir === "rtl" ? "text-left" : "text-right"
                    } text-sm font-medium`}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInfoItem(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-955/20 h-7 px-2"
                    >
                      {t("delete")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
