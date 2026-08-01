"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Edit2, Trash2, Package, AlertTriangle, Loader2 } from "lucide-react";
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

interface ProductListTableProps {
  products: Product[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  handleSort: (field: string) => void;
  isTogglingAlert: boolean;
  togglingAlertId?: string | null;
  handleToggleAlert: (id: string, current: boolean) => Promise<void>;
  setDeleteTargetId: (id: string | null) => void;
  dir: "ltr" | "rtl";
  language: "en" | "ku";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function ProductListTable({
  products,
  sortBy,
  sortOrder,
  handleSort,
  isTogglingAlert,
  togglingAlertId,
  handleToggleAlert,
  setDeleteTargetId,
  dir,
  language,
  t,
}: ProductListTableProps) {
  const { formatCurrency } = useLanguage();
  const renderSortHeader = (field: string, label: string, className?: string) => {
    const isSorted = sortBy === field;
    return (
      <TableHead
        className={cn("cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors select-none", className)}
        onClick={() => handleSort(field)}
      >
        <div className={cn("flex items-center gap-1.5", className?.includes("text-right") && "justify-end")}>
          <span>{label}</span>
          <span className="text-xs text-zinc-400">{isSorted ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}</span>
        </div>
      </TableHead>
    );
  };

  return (
    <Table>
      <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
        <TableRow className="border-zinc-200 dark:border-zinc-800">
          <TableHead className={`w-16 ${dir === "rtl" ? "text-right" : "text-left"}`}>{t("image")}</TableHead>
          {renderSortHeader("title", t("product_title"))}
          <TableHead className={dir === "rtl" ? "text-right" : "text-left"}>{t("category_brand")}</TableHead>
          {renderSortHeader("middlePrice", t("middle_price"), dir === "rtl" ? "text-left" : "text-right")}
          {renderSortHeader("finalPrice", t("final_price"), dir === "rtl" ? "text-left" : "text-right")}
          <TableHead className={dir === "rtl" ? "text-left" : "text-right"}>{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const isToggling = isTogglingAlert && togglingAlertId === product.id;
          return (
            <TableRow key={product.id} className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
              <TableCell className="p-3">
                <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                  {product.image ? (
                    <Image src={product.image} alt={getLocalizedValue(product.title, language)} className="object-cover" fill sizes="40px" />
                  ) : (
                    <Package className="h-5 w-5 text-zinc-400" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100 max-w-[200px] truncate">{getLocalizedValue(product.title, language)}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-650 dark:text-zinc-300">{product.category?.title || "Uncategorized"}</span>
                  {product.brand && <span className="text-xs text-zinc-450 dark:text-zinc-500">{t("brand")}: {product.brand}</span>}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-zinc-600 dark:text-zinc-400">{formatCurrency(product.middlePrice)}</TableCell>
              <TableCell className="text-right font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(product.finalPrice)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger render={
                        <Button variant="ghost" size="icon" disabled={isToggling} onClick={() => handleToggleAlert(product.id, product.actionAlert)} className={cn("h-8 w-8 transition-colors", product.actionAlert ? "text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300" : "text-zinc-400 hover:text-zinc-500 dark:text-zinc-655 dark:hover:text-zinc-500")}>
                          {isToggling ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className={cn("h-4 w-4", product.actionAlert && "fill-current")} />}
                        </Button>
                      } />
                      <TooltipContent><p>{product.actionAlert ? t("disable_action_alert") : t("enable_action_alert")}</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger render={<Link href={`/dashboard/products/${product.id}?tab=product-management`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800")}><Eye className="h-4 w-4" /></Link>} />
                      <TooltipContent><p>{t("view")}</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger render={<Link href={`/dashboard/products/${product.id}/edit?tab=product-management`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800")}><Edit2 className="h-4 w-4" /></Link>} />
                      <TooltipContent><p>{t("edit")}</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={() => setDeleteTargetId(product.id)} className="h-8 w-8 text-red-655 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-700 dark:hover:text-red-300"><Trash2 className="h-4 w-4" /></Button>} />
                      <TooltipContent><p>{t("delete")}</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
