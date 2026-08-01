"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getLocalizedValue } from "@/lib/utils";
import { Product } from "@/domain/entities/Product";
import { useLanguage } from "@/presentation/components/language-provider";

interface NeedListAlertedProductsProps {
  products: Product[];
  viewMode: "list" | "card";
  searchQuery: string;
  clearFilters: () => void;
  language: "en" | "ku";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function NeedListAlertedProducts({
  products,
  viewMode,
  searchQuery,
  clearFilters,
  language,
  t,
}: NeedListAlertedProductsProps) {
  const { formatCurrency } = useLanguage();
  if (products.length === 0) {
    return (
      <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-955/40 py-12 px-6 text-center rounded-xl">
        <CardContent className="space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">
            <Package className="h-6 w-6 shrink-0" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 text-center">
              {t("no_alerted_products", { defaultValue: "No Alerted Products" })}
            </h3>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto text-center">
              {t("no_alerted_products_desc", { defaultValue: "Currently, there are no products marked with action alerts that need restocked." })}
            </p>
          </div>
          {searchQuery && (
            <Button variant="outline" onClick={clearFilters} className="mt-1 border-zinc-200 dark:border-zinc-800 rounded-lg h-8 text-xs cursor-pointer">
              {t("clear_search", { defaultValue: "Clear Search" })}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn(viewMode === "list" && "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 overflow-hidden shadow-xs")}>
      {viewMode === "list" ? (
        <Table className="text-xs">
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
            <TableRow className="border-zinc-200 dark:border-zinc-800 h-10">
              <TableHead className="text-start w-12">{t("image")}</TableHead>
              <TableHead className="text-start">{t("product_title")}</TableHead>
              <TableHead className="text-start">{t("category_brand")}</TableHead>
              <TableHead className="text-end">{t("middle_price")}</TableHead>
              <TableHead className="text-end">{t("final_price")}</TableHead>
              <TableHead className="text-end w-32">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors h-12">
                <TableCell className="p-1.5">
                  <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mx-auto">
                    {product.image ? (
                      <Image src={product.image} alt={getLocalizedValue(product.title, language)} className="object-cover" fill sizes="32px" />
                    ) : (
                      <Package className="h-4 w-4 text-zinc-400 shrink-0" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100 text-start">{getLocalizedValue(product.title, language)}</TableCell>
                <TableCell className="text-start">
                  <div className="flex flex-col">
                    <span className="font-medium text-zinc-650 dark:text-zinc-300">{product.category?.title || "Uncategorized"}</span>
                    {product.brand && <span className="text-[10px] text-zinc-400 dark:text-zinc-550">{product.brand}</span>}
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-455 font-medium text-end">{formatCurrency(product.middlePrice)}</TableCell>
                <TableCell className="font-bold text-zinc-955 dark:text-zinc-50 text-end">{formatCurrency(product.finalPrice)}</TableCell>
                <TableCell className="text-end">
                  <div className="flex justify-end items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger render={<Link href={`/dashboard/products/${product.id}?tab=product-management`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors")}><Eye className="h-4 w-4" /></Link>} />
                        <TooltipContent className="bg-zinc-955 text-white dark:bg-white dark:text-zinc-955 rounded-lg p-1.5 text-[10px]"><p>{t("view_product_details", { defaultValue: "View Product Details" })}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 hover:shadow-md transition-all duration-300 flex flex-row items-stretch h-36 text-start text-xs">
              <div className="relative w-28 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border-r rtl:border-r-0 rtl:border-l border-zinc-100 dark:border-zinc-900">
                {product.image ? (
                  <Image src={product.image} alt={getLocalizedValue(product.title, language)} className="object-cover" fill sizes="120px" />
                ) : (
                  <Package className="h-8 w-8 text-zinc-350 dark:text-zinc-700" />
                )}
              </div>
              <CardContent className="p-3 flex-1 flex flex-col justify-between gap-1.5 min-w-0">
                <div className="space-y-1 text-start min-w-0">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm truncate">{getLocalizedValue(product.title, language)}</h3>
                  <div className="flex flex-col gap-0.5 text-[10px]">
                    <span className="font-semibold text-zinc-500 dark:text-zinc-400 truncate">{product.category?.title || "Uncategorized"}</span>
                    {product.brand && <span className="text-zinc-400 dark:text-zinc-550 truncate">{product.brand}</span>}
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-zinc-100 dark:border-zinc-900 text-start">
                    <div className="flex flex-col text-start">
                      <span className="text-[8px] text-zinc-400 dark:text-zinc-550 uppercase">{t("middle_price")}</span>
                      <span className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">{formatCurrency(product.middlePrice)}</span>
                    </div>
                    <div className="flex flex-col items-end text-start">
                      <span className="text-[8px] text-zinc-400 dark:text-zinc-550 uppercase">{t("final_price")}</span>
                      <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50">{formatCurrency(product.finalPrice)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-1 pt-1 border-t border-zinc-100 dark:border-zinc-900">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger render={<Link href={`/dashboard/products/${product.id}?tab=product-management`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-7 w-7 text-zinc-655 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors")}><Eye className="h-3.5 w-3.5" /></Link>} />
                      <TooltipContent className="bg-zinc-955 text-white dark:bg-white dark:text-zinc-955 rounded-lg p-1.5 text-[10px]"><p>{t("view_product_details", { defaultValue: "View Product Details" })}</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
