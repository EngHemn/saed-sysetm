"use client";

import React from "react";
import Image from "next/image";
import { Search, ChevronDown, Eye, X, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getLocalizedValue } from "@/lib/utils";
import { Product } from "@/domain/entities/Product";
import { useLanguage } from "@/presentation/components/language-provider";

interface BillFormProductComboboxProps {
  comboboxRef: React.RefObject<HTMLDivElement | null>;
  searchProductQuery: string;
  setSearchProductQuery: (query: string) => void;
  setCustomProductName: (name: string) => void;
  isComboboxOpen: boolean;
  setIsComboboxOpen: (open: boolean) => void;
  setIsAddProductDialogOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  selectedProductId: string | null;
  setDrawerProduct: (product: Product | null) => void;
  handleClearSelectedProduct: () => void;
  filteredProducts: Product[];
  handleSelectProduct: (product: Product) => void;
  items: any[];
  dir: "ltr" | "rtl";
  language: "en" | "ku";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillFormProductCombobox({
  comboboxRef,
  searchProductQuery,
  setSearchProductQuery,
  setCustomProductName,
  isComboboxOpen,
  setIsComboboxOpen,
  setIsAddProductDialogOpen,
  selectedProduct,
  selectedProductId,
  setDrawerProduct,
  handleClearSelectedProduct,
  filteredProducts,
  handleSelectProduct,
  items,
  dir,
  language,
  t,
}: BillFormProductComboboxProps) {
  const { formatCurrency } = useLanguage();
  return (
    <div className="sm:col-span-6 space-y-1.5 relative" ref={comboboxRef}>
      <Label className="text-xs text-zinc-650 dark:text-zinc-400 text-left block">
        {t("search_product_title", {
          defaultValue: "Search Product Title",
        })}
      </Label>
      <div className="relative flex items-center">
        <Search
          className={`absolute ${
            dir === "rtl" ? "right-3" : "left-3"
          } top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none`}
        />
        <Input
          placeholder={t("type_product_to_search", {
            defaultValue: "Type product title to search...",
          })}
          value={searchProductQuery}
          onChange={(e) => {
            setSearchProductQuery(e.target.value);
            setCustomProductName(e.target.value);
            setIsComboboxOpen(true);
          }}
          onFocus={() => setIsComboboxOpen(true)}
          className={`${
            dir === "rtl" ? "pr-9 pl-20" : "pl-9 pr-20"
          } bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-left`}
        />
        <div
          className={`absolute ${
            dir === "rtl" ? "left-2" : "right-2"
          } flex items-center gap-1`}
        >
          {selectedProduct && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setDrawerProduct(selectedProduct)}
                      className="h-7 w-7 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  }
                />
                <TooltipContent>
                  <p>{t("view")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {searchProductQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClearSelectedProduct}
              className="h-7 w-7 text-zinc-400 hover:text-zinc-600 shrink-0 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <ChevronDown className="h-4 w-4 text-zinc-400 pointer-events-none mr-1 shrink-0" />
        </div>
      </div>

      {isComboboxOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 shadow-lg p-1 space-y-1">
          {filteredProducts.length === 0 ? (
            <div className="p-3 text-xs text-center space-y-2">
              <p className="text-zinc-500">
                {t("no_matching_product", {
                  defaultValue: "No matching product found.",
                })}
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsComboboxOpen(false);
                  setIsAddProductDialogOpen(true);
                }}
                className="w-full text-xs h-8 cursor-pointer"
              >
                {t("add_product")}
              </Button>
            </div>
          ) : (
            <>
              {filteredProducts.map((prod) => {
                const prodTitle = getLocalizedValue(prod.title, language);
                const isAlreadyAdded = items.some(
                  (item) =>
                    item.productId === prod.id ||
                    item.productName.trim().toLowerCase() ===
                      prodTitle.trim().toLowerCase()
                );
                return (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-xs",
                      selectedProductId === prod.id &&
                        "bg-zinc-100 dark:bg-zinc-900 font-semibold"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative h-8 w-8 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-850 shrink-0 flex items-center justify-center">
                        {prod.image ? (
                          <Image
                            src={prod.image}
                            alt={prodTitle}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        ) : (
                          <Package className="h-4 w-4 text-zinc-400" />
                        )}
                      </div>
                      <div className="truncate flex items-center gap-2">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate text-left">
                          {prodTitle}
                        </p>
                        {isAlreadyAdded && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-800 dark:bg-amber-955 dark:text-amber-300 shrink-0"
                          >
                            {t("in_bill", { defaultValue: "In Bill" })}
                          </Badge>
                        )}
                      </div>
                    </div>
                     <div className="text-right shrink-0 ml-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {t("initial", { defaultValue: "Initial" })}:{" "}
                        {formatCurrency(prod.initPrice)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-zinc-100 dark:border-zinc-900 pt-1.5 mt-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsComboboxOpen(false);
                    setIsAddProductDialogOpen(true);
                  }}
                  className="w-full text-xs h-8 text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  + {t("add_product")}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
