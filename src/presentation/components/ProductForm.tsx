"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { ProductInput } from "@/domain/schemas/product";
import { useCategories } from "@/presentation/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLanguage } from "./language-provider";
import { ProductFormFields, ProductFormInput } from "./product-form/ProductFormFields";
import { ProductFormImageSection } from "./product-form/ProductFormImageSection";
import { useImageUpload } from "@/presentation/hooks/useImageUpload";

const productFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  image: z.string().url("Invalid image URL").nullable().optional().or(z.literal("")),
  initPrice: z.number({ message: "Price is required" }).min(0, "Initial price must be at least 0"),
  middlePrice: z.number({ message: "Price is required" }).min(0, "Middle price must be at least 0"),
  finalPrice: z.number({ message: "Price is required" }).min(0, "Final price must be at least 0"),
  brand: z.string().nullable().optional(),
  categoryId: z.string().min(1, "Category is required"),
  actionAlert: z.boolean(),
});

interface ProductFormProps {
  onSubmit: (data: ProductInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ProductForm({ onSubmit, onCancel, isSubmitting }: ProductFormProps) {
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { t, dir } = useLanguage();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      initPrice: undefined as unknown as number,
      middlePrice: undefined as unknown as number,
      finalPrice: undefined as unknown as number,
      brand: "",
      categoryId: "",
      actionAlert: false,
    },
  });

  const {
    isCompressing,
    isUploading: uploadingImage,
    isLoading: isImageLoading,
    error: imageError,
    handleFileChange: handleImageUpload,
  } = useImageUpload({
    onSuccess: (url) => {
      setValue("image", url, { shouldValidate: true });
    },
  });

  const imageUrl = watch("image");
  const selectedCategoryId = watch("categoryId");
  const selectedBrand = watch("brand");

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
  const categoryBrands = selectedCategory?.brand || [];

  const removeImage = () => {
    setValue("image", "", { shouldValidate: true });
  };

  const handleFormSubmit = async (data: ProductFormInput) => {
    const apiData: ProductInput = {
      title: JSON.stringify({ en: data.title, ku: data.title }),
      description: JSON.stringify({ en: data.description || "", ku: data.description || "" }),
      image: data.image,
      initPrice: Number(data.initPrice),
      middlePrice: Number(data.middlePrice),
      finalPrice: Number(data.finalPrice),
      brand: data.brand,
      categoryId: data.categoryId,
      actionAlert: data.actionAlert,
      info: [],
    };
    await onSubmit(apiData);
  };

  const getValidationError = (message: string | undefined) => {
    if (!message) return undefined;
    if (message === "Title is required") return t("title_required", { defaultValue: "Title is required" });
    if (message === "Category is required") return t("category_required");
    if (message === "Price is required" || message === "Initial price must be at least 0") return t("init_price_min");
    if (message === "Middle price must be at least 0") return t("middle_price_min");
    if (message === "Final price must be at least 0") return t("final_price_min");
    return t(message);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1" dir={dir}>
      <ProductFormFields
        register={register}
        setValue={setValue}
        errors={errors}
        selectedCategoryId={selectedCategoryId}
        selectedBrand={selectedBrand}
        selectedCategory={selectedCategory}
        categoryBrands={categoryBrands}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        getValidationError={getValidationError}
        t={t}
      />

      <ProductFormImageSection
        imageUrl={imageUrl}
        uploadingImage={uploadingImage}
        isCompressing={isCompressing}
        isImageLoading={isImageLoading}
        imageError={imageError}
        handleImageUpload={handleImageUpload}
        removeImage={removeImage}
        t={t}
      />

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="inline-actionAlert"
          {...register("actionAlert")}
          className="h-4 w-4 rounded-sm border border-zinc-300 dark:border-zinc-850"
        />
        <Label htmlFor="inline-actionAlert" className="text-zinc-900 dark:text-zinc-300 cursor-pointer">
          {t("action_alert_desc")}
        </Label>
      </div>

      <div className={`flex items-center ${dir === "rtl" ? "justify-start" : "justify-end"} gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-900`}>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting || uploadingImage}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
