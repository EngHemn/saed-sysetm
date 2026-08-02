"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/domain/entities/Category";

export interface ProductFormInput {
  title: string;
  description?: string | null;
  image?: string | null;
  initPrice: number;
  middlePrice: number;
  finalPrice: number;
  brand?: string | null;
  categoryId: string;
  actionAlert: boolean;
}

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormInput>;
  setValue: UseFormSetValue<ProductFormInput>;
  errors: FieldErrors<ProductFormInput>;
  selectedCategoryId: string;
  selectedBrand?: string | null;
  selectedCategory?: Category;
  categoryBrands: string[];
  categories: Category[];
  isLoadingCategories: boolean;
  getValidationError: (msg?: string) => string | undefined;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function ProductFormFields({
  register,
  setValue,
  errors,
  selectedCategoryId,
  selectedBrand,
  selectedCategory,
  categoryBrands,
  categories,
  isLoadingCategories,
  getValidationError,
  t,
}: ProductFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inline-title" className="text-zinc-900 dark:text-zinc-300 text-start block">
            {t("product_title")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inline-title"
            placeholder={t("product_title")}
            {...register("title")}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-start"
          />
          {errors.title && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400 text-start">
              {getValidationError(errors.title.message)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inline-product-category" className="text-zinc-900 dark:text-zinc-300 text-start block">
            {t("category")} <span className="text-red-500">*</span>
          </Label>
          {isLoadingCategories ? (
            <div className="h-10 w-full rounded-md bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
          ) : (
            <Select
              value={selectedCategoryId}
              onValueChange={(val) => {
                setValue("categoryId", val || "", { shouldValidate: true });
                setValue("brand", "");
              }}
            >
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-xs">
                <SelectValue placeholder={t("category")}>
                  {selectedCategory?.title}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 text-xs">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.categoryId && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400 text-start">
              {getValidationError(errors.categoryId.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inline-product-brand" className="text-zinc-900 dark:text-zinc-300 text-start block">
            {t("brand")}
          </Label>
          {categoryBrands.length > 0 ? (
            <Select
              value={selectedBrand || ""}
              onValueChange={(val) => setValue("brand", val || "", { shouldValidate: true })}
            >
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-xs">
                <SelectValue placeholder={t("brand")} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 text-xs">
                <SelectItem value="">{t("none", { defaultValue: "None" })}</SelectItem>
                {categoryBrands.map((b, idx) => (
                  <SelectItem key={idx} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="inline-product-brand"
              placeholder={t("brand")}
              {...register("brand")}
              className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-start"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inline-product-initPrice" className="text-zinc-900 dark:text-zinc-300 text-start block">
            {t("purchase_price")} ({t("currency")}) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inline-product-initPrice"
            type="number"
            step="1"
            {...register("initPrice", { valueAsNumber: true })}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-start"
          />
          {errors.initPrice && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400 text-start">
              {getValidationError(errors.initPrice.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inline-product-middlePrice" className="text-zinc-900 dark:text-zinc-300 text-start block">
            {t("middle_price")} ({t("currency")}) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inline-product-middlePrice"
            type="number"
            step="1"
            {...register("middlePrice", { valueAsNumber: true })}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-start"
          />
          {errors.middlePrice && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400 text-start">
              {getValidationError(errors.middlePrice.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inline-product-finalPrice" className="text-zinc-900 dark:text-zinc-300 text-start block">
            {t("final_price")} ({t("currency")}) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inline-product-finalPrice"
            type="number"
            step="1"
            {...register("finalPrice", { valueAsNumber: true })}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-start"
          />
          {errors.finalPrice && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400 text-start">
              {getValidationError(errors.finalPrice.message)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inline-product-description" className="text-zinc-900 dark:text-zinc-300 text-start block">
            {t("description")}
          </Label>
          <Input
            id="inline-product-description"
            placeholder={t("description")}
            {...register("description")}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-start"
          />
        </div>
      </div>
    </>
  );
}
