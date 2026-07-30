"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/domain/entities/Category";
import { ProductInput } from "@/domain/schemas/product";

interface ProductFormBasicSectionProps {
  register: any;
  setValue: any;
  errors: any;
  selectedCategoryId: string;
  selectedBrand?: string | null;
  selectedCategory?: Category;
  categoryBrands: string[];
  categories: Category[];
  isLoadingCategories: boolean;
  getValidationError: (msg?: string) => any;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function ProductFormBasicSection({
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
}: ProductFormBasicSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title_en" className="text-zinc-900 dark:text-zinc-300 text-left block">
            {t("product_title")} (English) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title_en"
            placeholder={t("product_title") + " (English)"}
            {...register("title_en")}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 text-left"
          />
          {errors.title_en && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400 text-left">
              {getValidationError(errors.title_en.message)}
            </p>
          )}
        </div>
        <div className="space-y-2" dir="rtl">
          <Label htmlFor="title_ku" className="text-zinc-900 dark:text-zinc-300 text-right block">
            {t("product_title")} (کوردی) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title_ku"
            placeholder={t("product_title") + " (کوردی)"}
            {...register("title_ku")}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 text-right"
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
          <Label htmlFor="category" className="text-zinc-900 dark:text-zinc-300 text-left block">
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
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder={t("category")}>
                  {selectedCategory?.title}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.categoryId && (
            <p className="text-xs font-medium text-red-655 dark:text-red-400 text-left">
              {getValidationError(errors.categoryId.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand" className="text-zinc-900 dark:text-zinc-300 text-left block">
            {t("brand")}
          </Label>
          {categoryBrands.length > 0 ? (
            <Select
              value={selectedBrand || ""}
              onValueChange={(val) => setValue("brand", val || "", { shouldValidate: true })}
            >
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder={t("brand")} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800">
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
              id="brand"
              placeholder={t("brand")}
              {...register("brand")}
              className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="initPrice" className="text-zinc-900 dark:text-zinc-300 text-left block">
            {t("purchase_price")} ($) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="initPrice"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("initPrice", { valueAsNumber: true })}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
          />
          {errors.initPrice && (
            <p className="text-xs font-medium text-red-655 dark:text-red-400 text-left">
              {getValidationError(errors.initPrice.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="middlePrice" className="text-zinc-900 dark:text-zinc-300 text-left block">
            {t("middle_price")} ($) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="middlePrice"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("middlePrice", { valueAsNumber: true })}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
          />
          {errors.middlePrice && (
            <p className="text-xs font-medium text-red-655 dark:text-red-400 text-left">
              {getValidationError(errors.middlePrice.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="finalPrice" className="text-zinc-900 dark:text-zinc-300 text-left block">
            {t("final_price")} ($) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="finalPrice"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("finalPrice", { valueAsNumber: true })}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
          />
          {errors.finalPrice && (
            <p className="text-xs font-medium text-red-655 dark:text-red-400 text-left">
              {getValidationError(errors.finalPrice.message)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description_en" className="text-zinc-900 dark:text-zinc-300 text-left block">
            {t("description")} (English)
          </Label>
          <Textarea
            id="description_en"
            placeholder={t("description") + " (English)"}
            rows={4}
            {...register("description_en")}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 resize-none text-left"
          />
        </div>
        <div className="space-y-2" dir="rtl">
          <Label htmlFor="description_ku" className="text-zinc-900 dark:text-zinc-300 text-right block">
            {t("description")} (کوردی)
          </Label>
          <Textarea
            id="description_ku"
            placeholder={t("description") + " (کوردی)"}
            rows={4}
            {...register("description_ku")}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 resize-none text-right"
          />
        </div>
      </div>
    </>
  );
}
