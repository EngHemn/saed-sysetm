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

const productFormSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ku: z.string().min(1, "Kurdish title is required"),
  description_en: z.string().nullable().optional(),
  description_ku: z.string().nullable().optional(),
  image: z.string().url("Invalid image URL").nullable().optional().or(z.literal("")),
  initPrice: z.number().min(0, "Initial price must be at least 0"),
  middlePrice: z.number().min(0, "Middle price must be at least 0"),
  finalPrice: z.number().min(0, "Final price must be at least 0"),
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
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
      title_en: "",
      title_ku: "",
      description_en: "",
      description_ku: "",
      image: "",
      initPrice: 0,
      middlePrice: 0,
      finalPrice: 0,
      brand: "",
      categoryId: "",
      actionAlert: false,
    },
  });

  const imageUrl = watch("image");
  const selectedCategoryId = watch("categoryId");
  const selectedBrand = watch("brand");

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
  const categoryBrands = selectedCategory?.brand || [];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      if (data.success && data.result?.secure_url) {
        setValue("image", data.result.secure_url, { shouldValidate: true });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during upload";
      setImageError(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setValue("image", "", { shouldValidate: true });
  };

  const handleFormSubmit = async (data: ProductFormInput) => {
    const apiData: ProductInput = {
      title: JSON.stringify({ en: data.title_en, ku: data.title_ku }),
      description: JSON.stringify({ en: data.description_en || "", ku: data.description_ku || "" }),
      image: data.image,
      initPrice: data.initPrice,
      middlePrice: data.middlePrice,
      finalPrice: data.finalPrice,
      brand: data.brand,
      categoryId: data.categoryId,
      actionAlert: data.actionAlert,
      info: [],
    };
    await onSubmit(apiData);
  };

  const getValidationError = (message: string | undefined) => {
    if (!message) return undefined;
    if (message === "English title is required") return t("title_required_en", { defaultValue: "English title is required" });
    if (message === "Kurdish title is required") return t("title_required_ku", { defaultValue: "Kurdish title is required" });
    if (message === "Category is required") return t("category_required");
    if (message === "Initial price must be at least 0") return t("init_price_min");
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
