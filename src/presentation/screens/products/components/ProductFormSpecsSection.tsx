"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export interface ProductInfoItem {
  title_en: string;
  title_ku: string;
  description_en: string;
  description_ku: string;
}

interface ProductFormSpecsSectionProps {
  infoList: ProductInfoItem[];
  infoTitleEn: string;
  setInfoTitleEn: (val: string) => void;
  infoTitleKu: string;
  setInfoTitleKu: (val: string) => void;
  infoDescriptionEn: string;
  setInfoDescriptionEn: (val: string) => void;
  infoDescriptionKu: string;
  setInfoDescriptionKu: (val: string) => void;
  addInfoItem: () => void;
  removeInfoItem: (index: number) => void;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function ProductFormSpecsSection({
  infoList,
  infoTitleEn,
  setInfoTitleEn,
  infoTitleKu,
  setInfoTitleKu,
  infoDescriptionEn,
  setInfoDescriptionEn,
  infoDescriptionKu,
  setInfoDescriptionKu,
  addInfoItem,
  removeInfoItem,
  dir,
  t,
}: ProductFormSpecsSectionProps) {
  return (
    <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-900 pt-4">
      <Label className="text-zinc-900 dark:text-zinc-300 font-semibold text-left block">
        {t("specifications")}
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-zinc-700 dark:text-zinc-400 text-xs font-semibold block text-left">
            Specification (English)
          </Label>
          <Input
            placeholder="Title (English)"
            value={infoTitleEn}
            onChange={(e) => setInfoTitleEn(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-left mb-2"
          />
          <Input
            placeholder="Description (English)"
            value={infoDescriptionEn}
            onChange={(e) => setInfoDescriptionEn(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-left"
          />
        </div>
        <div className="space-y-2" dir="rtl">
          <Label className="text-zinc-700 dark:text-zinc-400 text-xs font-semibold block text-right">
            ناونیشان و وەسفی تایبەتمەندی (کوردی)
          </Label>
          <Input
            placeholder="ناونیشان (کوردی)"
            value={infoTitleKu}
            onChange={(e) => setInfoTitleKu(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-right mb-2"
          />
          <Input
            placeholder="وەسف (کوردی)"
            value={infoDescriptionKu}
            onChange={(e) => setInfoDescriptionKu(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-right"
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
                    dir === "rtl" ? "text-right" : "text-left"
                  } text-xs font-medium text-zinc-500 uppercase tracking-wider`}
                >
                  {t("title", { defaultValue: "Title" })}
                </th>
                <th
                  className={`px-4 py-2 ${
                    dir === "rtl" ? "text-right" : "text-left"
                  } text-xs font-medium text-zinc-500 uppercase tracking-wider`}
                >
                  {t("description")}
                </th>
                <th
                  className={`px-4 py-2 ${
                    dir === "rtl" ? "text-left" : "text-right"
                  } text-xs font-medium text-zinc-500 uppercase tracking-wider w-16`}
                >
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-955">
              {infoList.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-150 text-left">
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-500 font-semibold">
                        EN: {item.title_en}
                      </span>
                      <span className="text-xs text-zinc-400" dir="rtl">
                        KU: {item.title_ku}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400 text-left">
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-500">
                        EN: {item.description_en}
                      </span>
                      <span className="text-xs text-zinc-400" dir="rtl">
                        KU: {item.description_ku}
                      </span>
                    </div>
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
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-7 px-2"
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
