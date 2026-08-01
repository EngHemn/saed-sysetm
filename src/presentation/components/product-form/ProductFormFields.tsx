"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/domain/entities/Category";

export interface ProductFormInput {
  title_en: string;
  title_ku: string;
  description_en?: string | null;
  description_ku?: string | null;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inline-title-en" className="text-zinc-900 dark:text-zinc-300 text-left block">
            {t("product_title")} (English) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inline-title-en"
            placeholder={t("product_title") + " (English)"}
            {...register("title_en")}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-left"
          />
          {errors.title_en && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400 text-left">
              {getValidationError(errors.title_en.message)}
            </p>
          )}
        </div>
        <div className="space-y-2" dir="rtl">
          <Label htmlFor="inline-title-ku" className="text-zinc-900 dark:text-zinc-300 text-right block">
            {t("product_title")} (کوردی) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inline-title-ku"
            placeholder={t("product_title") + " (کوردی)"}
            {...register("title_ku")}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-right"
          />
          {errors.title_ku && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400 text-right">
              {getValidationError(errors.title_ku.message)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inline-product-category" className="text-zinc-900 dark:text-zinc-300 text-left block">
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
            <p className="text-xs font-medium text-red-555 dark:text-red-400 text-left">
              {getValidationError(errors.categoryId.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inline-product-brand" className="text-zinc-900 dark:text-zinc-300 text-left block">
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
              className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-left"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inline-product-initPrice" className="text-zinc-900 dark:text-zinc-300 text-left block">
            {t("purchase_price")} ({t("currency")}) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inline-product-initPrice"
            type="number"
            step="1"
            placeholder="0"
            {...register("initPrice", { valueAsNumber: true })}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-left"
          />
          {errors.initPrice && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400 text-left">
              {getValidationError(errors.initPrice.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inline-product-middlePrice" className="text-zinc-900 dark:text-zinc-300 text-left block">
            {t("middle_price")} ({t("currency")}) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inline-product-middlePrice"
            type="number"
            step="1"
            placeholder="0"
            {...register("middlePrice", { valueAsNumber: true })}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-left"
          />
          {errors.middlePrice && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400 text-left">
              {getValidationError(errors.middlePrice.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inline-product-finalPrice" className="text-zinc-900 dark:text-zinc-300 text-left block">
            {t("final_price")} ({t("currency")}) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inline-product-finalPrice"
            type="number"
            step="1"
            placeholder="0"
            {...register("finalPrice", { valueAsNumber: true })}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-left"
          />
          {errors.finalPrice && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400 text-left">
              {getValidationError(errors.finalPrice.message)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inline-product-description-en" className="text-zinc-900 dark:text-zinc-300 text-left block">
            {t("description")} (English)
          </Label>
          <Textarea
            id="inline-product-description-en"
            placeholder={t("description") + " (English)"}
            rows={3}
            {...register("description_en")}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 resize-none text-left"
          />
        </div>
        <div className="space-y-2" dir="rtl">
          <Label htmlFor="inline-product-description-ku" className="text-zinc-900 dark:text-zinc-300 text-right block">
            {t("description")} (کوردی)
          </Label>
          <Textarea
            id="inline-product-description-ku"
            placeholder={t("description") + " (کوردی)"}
            rows={3}
            {...register("description_ku")}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 resize-none text-right"
          />
        </div>
      </div>
    </>
  );
}
