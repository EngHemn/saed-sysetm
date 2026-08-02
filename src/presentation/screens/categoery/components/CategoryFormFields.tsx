"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CategoryInput } from "@/domain/schemas/category";

interface CategoryFormFieldsProps {
  register: UseFormRegister<CategoryInput>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<CategoryInput>;
  isSubmitting: boolean;
  uploadingImage: boolean;
  isCompressing?: boolean;
  isImageLoading?: boolean;
  imageError: string | null;
  imageUrl: string | null | undefined;
  brands: string[];
  brandInput: string;
  setBrandInput: (val: string) => void;
  addBrand: () => void;
  removeBrand: (idx: number) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<string | null> | Promise<void>;
  removeImage: () => void;
  getValidationError: (msg?: string) => any;
  t: (key: string, values?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
}

export function CategoryFormFields({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  uploadingImage,
  isCompressing,
  isImageLoading,
  imageError,
  imageUrl,
  brands,
  brandInput,
  setBrandInput,
  addBrand,
  removeBrand,
  handleImageUpload,
  removeImage,
  getValidationError,
  t,
  dir,
}: CategoryFormFieldsProps) {
  const isLoadingImage = isImageLoading ?? uploadingImage;
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-zinc-900 dark:text-zinc-300 text-start block">
          {t("category_title")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder={t("category_title")}
          {...register("title")}
          className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 text-start"
        />
        {errors.title && (
          <p className="text-xs font-medium text-red-650 dark:text-red-400 text-start">
            {getValidationError(errors.title.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand-input" className="text-zinc-900 dark:text-zinc-300 text-start block">
          {t("brands")}
        </Label>
        <div className="flex gap-2">
          <Input
            id="brand-input"
            placeholder={t("brand_placeholder")}
            value={brandInput}
            onChange={(e) => setBrandInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addBrand();
              }
            }}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 text-start"
          />
          <Button
            type="button"
            onClick={addBrand}
            variant="outline"
            className="border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50"
          >
            {t("add")}
          </Button>
        </div>
        {brands.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {brands.map((b, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-xs font-medium pl-2.5 pr-1.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800"
              >
                {b}
                <button
                  type="button"
                  onClick={() => removeBrand(idx)}
                  className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 rounded-full cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.brand && (
          <p className="text-xs font-medium text-red-650 dark:text-red-400 text-start">
            {getValidationError(errors.brand.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-zinc-900 dark:text-zinc-300 text-start block">
          {t("description")}
        </Label>
        <Textarea
          id="description"
          placeholder={t("description")}
          rows={4}
          {...register("description")}
          className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 resize-none text-start"
        />
        {errors.description && (
          <p className="text-xs font-medium text-red-655 dark:text-red-400 text-start">
            {getValidationError(errors.description.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-900 dark:text-zinc-300 text-start block">{t("image")}</Label>
        {imageUrl ? (
          <div className="relative h-64 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden group">
            <Image
              src={imageUrl}
              alt="Uploaded category image"
              className="h-full w-full object-cover"
              width={300}
              height={300}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={removeImage}
              className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-90 hover:opacity-100 shadow-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-all">
            <input
              type="file"
              id="image-file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isLoadingImage}
            />
            <label
              htmlFor="image-file"
              className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full py-4"
            >
              {isLoadingImage ? (
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
              ) : (
                <Upload className="h-8 w-8 text-zinc-400" />
              )}
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {isCompressing
                  ? t("compressing_image", { defaultValue: "Compressing image..." })
                  : uploadingImage
                  ? t("uploading_image", { defaultValue: "Uploading image..." })
                  : t("upload_image", { defaultValue: "Upload an image" })}
              </span>
              <span className="text-xs text-zinc-500">PNG, JPG, WebP (auto-optimized 400-500 KB)</span>
            </label>
          </div>
        )}
        {imageError && (
          <p className="text-xs font-medium text-red-650 dark:text-red-400 text-start">
            {imageError}
          </p>
        )}
      </div>

      <div
        className={`pt-4 border-t border-zinc-150 dark:border-zinc-900 flex ${
          dir === "rtl" ? "justify-start" : "justify-end"
        } gap-3`}
      >
        <Link
          href="/dashboard/categories?tab=category-management"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900",
            isSubmitting && "pointer-events-none opacity-50",
          )}
        >
          {t("cancel")}
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting || isLoadingImage}
          className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t("updating")}
            </>
          ) : (
            t("save")
          )}
        </Button>
      </div>
    </form>
  );
}
