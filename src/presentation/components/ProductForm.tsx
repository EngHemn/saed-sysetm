import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { productSchema, ProductInput } from "@/domain/schemas/product";
import { useCategories } from "@/presentation/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFormProps {
  onSubmit: (data: ProductInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ProductForm({ onSubmit, onCancel, isSubmitting }: ProductFormProps) {
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      initPrice: 0,
      middlePrice: 0,
      finalPrice: 0,
      brand: "",
      categoryId: "",
      actionAlert: false,
      info: [],
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="space-y-2">
        <Label htmlFor="product-title" className="text-zinc-900 dark:text-zinc-300">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="product-title"
          placeholder="e.g. Premium Beard Oil"
          {...register("title")}
          className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800"
        />
        {errors.title && (
          <p className="text-xs font-medium text-red-555 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-category" className="text-zinc-900 dark:text-zinc-300">
            Category <span className="text-red-500">*</span>
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
                <SelectValue placeholder="Select Category">
                  {selectedCategory?.title}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.categoryId && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-brand" className="text-zinc-900 dark:text-zinc-300">
            Brand (Optional)
          </Label>
          {categoryBrands.length > 0 ? (
            <Select
              value={selectedBrand || ""}
              onValueChange={(val) => setValue("brand", val || "", { shouldValidate: true })}
            >
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-xs">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs">
                <SelectItem value="">None</SelectItem>
                {categoryBrands.map((b, idx) => (
                  <SelectItem key={idx} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="product-brand"
              placeholder="Enter brand name"
              {...register("brand")}
              className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-initPrice" className="text-zinc-900 dark:text-zinc-300">
            Initial Price ($) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="product-initPrice"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("initPrice", { valueAsNumber: true })}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800"
          />
          {errors.initPrice && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400">
              {errors.initPrice.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-middlePrice" className="text-zinc-900 dark:text-zinc-300">
            Middle Price ($) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="product-middlePrice"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("middlePrice", { valueAsNumber: true })}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800"
          />
          {errors.middlePrice && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400">
              {errors.middlePrice.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-finalPrice" className="text-zinc-900 dark:text-zinc-300">
            Final Price ($) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="product-finalPrice"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("finalPrice", { valueAsNumber: true })}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800"
          />
          {errors.finalPrice && (
            <p className="text-xs font-medium text-red-555 dark:text-red-400">
              {errors.finalPrice.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-description" className="text-zinc-900 dark:text-zinc-300">
          Description (Optional)
        </Label>
        <Textarea
          id="product-description"
          placeholder="Enter product details..."
          rows={3}
          {...register("description")}
          className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 resize-none animate-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-900 dark:text-zinc-300">Product Image (Optional)</Label>
        {imageUrl ? (
          <div className="relative h-40 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
            <Image
              src={imageUrl}
              alt="Product Image"
              className="h-full w-full object-cover"
              width={200}
              height={150}
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
          <div className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 rounded-lg p-4 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-all">
            <input
              type="file"
              id="inline-product-image-file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
            <label
              htmlFor="inline-product-image-file"
              className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full py-2"
            >
              {uploadingImage ? (
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
              ) : (
                <Upload className="h-6 w-6 text-zinc-400" />
              )}
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {uploadingImage ? "Uploading image..." : "Upload logo"}
              </span>
            </label>
          </div>
        )}
        {imageError && (
          <p className="text-xs font-medium text-red-555 dark:text-red-400">
            {imageError}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || uploadingImage}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Product
        </Button>
      </div>
    </form>
  );
}
