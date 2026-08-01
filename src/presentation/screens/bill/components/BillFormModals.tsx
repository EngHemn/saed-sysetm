"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CompanyForm } from "@/presentation/components/CompanyForm";
import { ProductForm } from "@/presentation/components/ProductForm";
import { getLocalizedValue } from "@/lib/utils";
import { Product } from "@/domain/entities/Product";
import { useLanguage } from "@/presentation/components/language-provider";

interface BillFormModalsProps {
  dialogItem: any | null;
  setDialogItem: (item: any | null) => void;
  dialogProductCatalog: Product | null;
  isAddCompanyDialogOpen: boolean;
  setIsAddCompanyDialogOpen: (open: boolean) => void;
  handleCreateCompanySubmit: (data: any) => Promise<void>;
  isCreatingCompany: boolean;
  isAddProductDialogOpen: boolean;
  setIsAddProductDialogOpen: (open: boolean) => void;
  handleCreateProductSubmit: (data: any) => Promise<void>;
  isCreatingProduct: boolean;
  dir: "ltr" | "rtl";
  language: "en" | "ku";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillFormModals({
  dialogItem,
  setDialogItem,
  dialogProductCatalog,
  isAddCompanyDialogOpen,
  setIsAddCompanyDialogOpen,
  handleCreateCompanySubmit,
  isCreatingCompany,
  isAddProductDialogOpen,
  setIsAddProductDialogOpen,
  handleCreateProductSubmit,
  isCreatingProduct,
  dir,
  language,
  t,
}: BillFormModalsProps) {
  const { formatCurrency } = useLanguage();
  return (
    <>
      <Dialog
        open={!!dialogItem}
        onOpenChange={(open) => {
          if (!open) {
            setDialogItem(null);
          }
        }}
      >
        <DialogContent
          className="max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
          dir={dir}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 text-left">
              {dialogItem ? dialogItem.productName : ""}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 text-left">
              {t("product_details_in_bill", {
                defaultValue: "Product details in bill items",
              })}
            </DialogDescription>
          </DialogHeader>

          {dialogItem ? (
            <div className="space-y-4 pt-2">
              {dialogProductCatalog && dialogProductCatalog.image && (
                <div className="relative h-48 w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <Image
                    src={dialogProductCatalog.image}
                    alt={dialogItem.productName}
                    fill
                    className="object-cover"
                    sizes="350px"
                  />
                </div>
              )}

              {dialogProductCatalog && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="secondary">
                    {t("category")}:{" "}
                    {dialogProductCatalog.category?.title || "Uncategorized"}
                  </Badge>
                  {dialogProductCatalog.brand && (
                    <Badge variant="outline">
                      {t("brand")}: {dialogProductCatalog.brand}
                    </Badge>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 block">
                    {t("purchase_price")}
                  </span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(dialogItem.initialPrice)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">
                    {t("middle_price")}
                  </span>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    {formatCurrency(dialogItem.middlePrice)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">
                    {t("final_price")}
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(dialogItem.finalPrice)}
                  </span>
                </div>
              </div>

              {dialogProductCatalog && dialogProductCatalog.description && (
                <div className="text-xs space-y-1 text-left">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                    {t("description")}:
                  </span>
                  <p className="text-zinc-555 dark:text-zinc-400">
                    {getLocalizedValue(
                      dialogProductCatalog.description,
                      language
                    )}
                  </p>
                </div>
              )}

              {!dialogProductCatalog && (
                <div className="py-2 text-xs text-zinc-500 text-left">
                  {t("custom_line_item", { defaultValue: "Custom line item" })}:{" "}
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {dialogItem.productName}
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddCompanyDialogOpen}
        onOpenChange={setIsAddCompanyDialogOpen}
      >
        <DialogContent
          className="max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
          dir={dir}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 text-left">
              {t("add_company")}
            </DialogTitle>
          </DialogHeader>
          <CompanyForm
            onSubmit={handleCreateCompanySubmit}
            onCancel={() => setIsAddCompanyDialogOpen(false)}
            isSubmitting={isCreatingCompany}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddProductDialogOpen}
        onOpenChange={setIsAddProductDialogOpen}
      >
        <DialogContent
          className="max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
          dir={dir}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 text-left">
              {t("add_product")}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreateProductSubmit}
            onCancel={() => setIsAddProductDialogOpen(false)}
            isSubmitting={isCreatingProduct}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
