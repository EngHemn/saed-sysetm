"use client";

import React from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { getLocalizedValue } from "@/lib/utils";
import { Product } from "@/domain/entities/Product";
import { useLanguage } from "@/presentation/components/language-provider";

interface BillFormProductSheetProps {
  drawerProduct: Product | null;
  setDrawerProduct: (prod: Product | null) => void;
  dir: "ltr" | "rtl";
  language: "en" | "ku";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillFormProductSheet({
  drawerProduct,
  setDrawerProduct,
  dir,
  language,
  t,
}: BillFormProductSheetProps) {
  const { formatCurrency } = useLanguage();
  return (
    <Sheet
      open={!!drawerProduct}
      onOpenChange={(open) => !open && setDrawerProduct(null)}
    >
      <SheetContent
        side={dir === "rtl" ? "right" : "left"}
        className="w-[85%] sm:max-w-md p-6 overflow-y-auto bg-white dark:bg-zinc-950"
        dir={dir}
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50 text-left">
            {t("product_info")}
          </SheetTitle>
          <SheetDescription className="text-xs text-zinc-500 text-left">
            {t("detailed_view_desc", {
              defaultValue: "Detailed view of product",
            })}
          </SheetDescription>
        </SheetHeader>

        {drawerProduct && (
          <div className="space-y-6 pt-4">
            {drawerProduct.image ? (
              <div className="relative h-56 w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <Image
                  src={drawerProduct.image}
                  alt={getLocalizedValue(drawerProduct.title, language)}
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
            ) : (
              <div className="h-40 w-full rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40">
                <Package className="h-10 w-10 shrink-0" />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {drawerProduct.category?.title || "Uncategorized"}
                </Badge>
                {drawerProduct.brand && (
                  <Badge variant="outline">
                    {t("brand")}: {drawerProduct.brand}
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 text-left">
                {getLocalizedValue(drawerProduct.title, language)}
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-center">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-zinc-455 uppercase block text-center">
                  {t("purchase_price")}
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 text-center block">
                  {formatCurrency(drawerProduct.initPrice)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-zinc-455 uppercase block text-center">
                  {t("middle_price")}
                </span>
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 text-center block">
                  {formatCurrency(drawerProduct.middlePrice)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-zinc-455 uppercase block text-center">
                  {t("final_price")}
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50 text-center block">
                  {formatCurrency(drawerProduct.finalPrice)}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <span className="text-xs font-semibold text-zinc-500 uppercase block">
                {t("stock", { defaultValue: "Current Stock" })}
              </span>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {drawerProduct.stock} {t("units", { defaultValue: "units" })}
              </p>
            </div>

            {drawerProduct.description && (
              <div className="space-y-1.5 text-left">
                <span className="text-xs font-semibold text-zinc-555 uppercase block">
                  {t("description")}
                </span>
                <p className="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400 whitespace-pre-wrap">
                  {getLocalizedValue(drawerProduct.description, language)}
                </p>
              </div>
            )}

            {drawerProduct.info &&
              Array.isArray(drawerProduct.info) &&
              drawerProduct.info.length > 0 && (
                <div className="space-y-2 text-left">
                  <span className="text-xs font-semibold text-zinc-555 uppercase block">
                    {t("specifications")}
                  </span>
                  <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
                    {(drawerProduct.info as any[]).map((item, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-3 p-2 bg-zinc-50/50 dark:bg-zinc-900/10"
                      >
                        <span className="font-medium text-zinc-500 col-span-1">
                          {getLocalizedValue(item.title, language)}
                        </span>
                        <span className="text-zinc-900 dark:text-zinc-100 col-span-2">
                          {getLocalizedValue(item.description, language)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
