"use client";

import React from "react";
import { FieldErrors, UseFieldArrayRemove } from "react-hook-form";
import { Eye, X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getLocalizedValue } from "@/lib/utils";
import { Product } from "@/domain/entities/Product";
import { BillInput } from "@/domain/schemas/bill";
import { BillFormProductCombobox } from "./BillFormProductCombobox";
import { BillFormItemsTable } from "./BillFormItemsTable";

interface BillFormProductsSectionProps {
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
  fields: Record<string, any>[];
  productQty: number;
  setProductQty: (qty: number) => void;
  productUnitPrice: number;
  setProductUnitPrice: (price: number) => void;
  handleAddProductItem: () => void;
  duplicateWarning: string | null;
  setDuplicateWarning: (warn: string | null) => void;
  errors: FieldErrors<BillInput>;
  setValue: (field: any, val: any, options?: any) => void;
  remove: UseFieldArrayRemove;
  handleViewTableItem: (item: any) => void;
  getValidationError: (msg?: string) => any;
  dir: "ltr" | "rtl";
  language: "en" | "ku";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillFormProductsSection({
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
  fields,
  productQty,
  setProductQty,
  productUnitPrice,
  setProductUnitPrice,
  handleAddProductItem,
  duplicateWarning,
  setDuplicateWarning,
  errors,
  setValue,
  remove,
  handleViewTableItem,
  getValidationError,
  dir,
  language,
  t,
}: BillFormProductsSectionProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 text-left">
          {t("bill_products_items", {
            defaultValue: "Bill Products & Items",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 text-left">
            {t("search_add_product", {
              defaultValue: "Search & Add Product Item",
            })}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <BillFormProductCombobox
              comboboxRef={comboboxRef}
              searchProductQuery={searchProductQuery}
              setSearchProductQuery={setSearchProductQuery}
              setCustomProductName={setCustomProductName}
              isComboboxOpen={isComboboxOpen}
              setIsComboboxOpen={setIsComboboxOpen}
              setIsAddProductDialogOpen={setIsAddProductDialogOpen}
              selectedProduct={selectedProduct}
              selectedProductId={selectedProductId}
              setDrawerProduct={setDrawerProduct}
              handleClearSelectedProduct={handleClearSelectedProduct}
              filteredProducts={filteredProducts}
              handleSelectProduct={handleSelectProduct}
              items={items}
              dir={dir}
              language={language}
              t={t}
            />

            <div className="sm:col-span-3 space-y-1.5">
              <Label className="text-xs text-zinc-650 dark:text-zinc-400 text-left block">
                {t("quantity")}
              </Label>
              <Input
                type="number"
                min="1"
                value={productQty}
                onChange={(e) =>
                  setProductQty(Math.max(1, parseInt(e.target.value, 10) || 1))
                }
                className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-left"
              />
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <Label className="text-xs text-zinc-650 dark:text-zinc-400 text-left block">
                {t("purchase_price")} ($)
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={productUnitPrice}
                onChange={(e) =>
                  setProductUnitPrice(
                    Math.max(0, parseFloat(e.target.value) || 0)
                  )
                }
                className="bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800 font-semibold text-left"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {selectedProduct ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">
                  {t("selected_product", {
                    defaultValue: "Selected Product",
                  })}
                  :
                </span>
                <Badge variant="outline" className="text-xs font-semibold">
                  {getLocalizedValue(selectedProduct.title, language)} ($
                  {selectedProduct.initPrice.toFixed(2)})
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDrawerProduct(selectedProduct)}
                  className="text-xs h-7 gap-1 text-zinc-600 dark:text-zinc-400 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {t("view_details")}
                </Button>
              </div>
            ) : (
              <div className="text-xs text-zinc-400 text-left">
                {t("entering_custom_product", {
                  defaultValue: "Entering incoming product data",
                })}
              </div>
            )}

            <Button
              type="button"
              onClick={handleAddProductItem}
              variant="secondary"
              className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-955 hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {t("add_item", { defaultValue: "Add Item" })}
            </Button>
          </div>
        </div>

        {duplicateWarning && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-955/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-medium flex items-center justify-between">
            <span>{duplicateWarning}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDuplicateWarning(null)}
              className="h-6 w-6 p-0 text-amber-600 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {errors.items && (
          <p className="text-xs font-medium text-red-655 dark:text-red-400 text-left">
            {getValidationError(errors.items.message)}
          </p>
        )}

        <BillFormItemsTable
          fields={fields}
          items={items}
          setValue={setValue}
          remove={remove}
          handleViewTableItem={handleViewTableItem}
          dir={dir}
          t={t}
        />
      </CardContent>
    </Card>
  );
}
