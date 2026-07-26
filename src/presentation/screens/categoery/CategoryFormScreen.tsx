"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import Link from "next/link";
import { categorySchema, CategoryInput } from "@/domain/schemas/category";
import { useCategories, useCategory } from "@/presentation/hooks/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CategoryFormScreenProps {
  id?: string;
}

export function CategoryFormScreen({ id }: CategoryFormScreenProps) {
  const router = useRouter();
  const isEditMode = !!id;
  const { createCategory, isCreating } = useCategories();
  const {
    category,
    isLoading: isFetching,
    updateCategory,
    isUpdating,
  } = useCategory(id);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
      image: "",
      description: "",
      brand: [],
    },
  });

  const imageUrl = watch("image");
  const brands = watch("brand") || [];
  const [brandInput, setBrandInput] = useState("");

  const addBrand = () => {
    const trimmed = brandInput.trim();
    if (trimmed && !brands.includes(trimmed)) {
      setValue("brand", [...brands, trimmed], { shouldValidate: true });
      setBrandInput("");
    }
  };

  const removeBrand = (indexToRemove: number) => {
    setValue(
      "brand",
      brands.filter((_, i) => i !== indexToRemove),
      { shouldValidate: true },
    );
  };

  useEffect(() => {
    if (category) {
      reset({
        title: category.title,
        image: category.image || "",
        description: category.description || "",
        brand: category.brand || [],
      });
    }
  }, [category, reset]);

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
    } catch (err: any) {
      setImageError(err.message || "An error occurred during upload");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setValue("image", "", { shouldValidate: true });
  };

  const onSubmit = async (data: CategoryInput) => {
    try {
      if (isEditMode && id) {
        await updateCategory(data);
      } else {
        await createCategory(data);
      }
      router.push("/dashboard/categories?tab=category-management");
    } catch (err) {
      console.error(err);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  if (isEditMode && isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/categories?tab=category-management"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9 text-zinc-600 dark:text-zinc-400 flex items-center justify-center",
          )}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {isEditMode ? "Edit Category" : "Add Category"}
          </h1>
          <p className="text-sm text-zinc-550 dark:text-zinc-400">
            {isEditMode
              ? "Update category information"
              : "Create a new category for your products"}
          </p>
        </div>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Category Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-zinc-900 dark:text-zinc-300"
              >
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Shaving Gel"
                {...register("title")}
                className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
              />
              {errors.title && (
                <p className="text-xs font-medium text-red-650 dark:text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="brand-input"
                className="text-zinc-900 dark:text-zinc-300"
              >
                Brands
              </Label>
              <div className="flex gap-2">
                <Input
                  id="brand-input"
                  placeholder="e.g. Gillette"
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addBrand();
                    }
                  }}
                  className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
                />
                <Button
                  type="button"
                  onClick={addBrand}
                  variant="outline"
                  className="border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50"
                >
                  Add
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
                        className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.brand && (
                <p className="text-xs font-medium text-red-650 dark:text-red-400">
                  {errors.brand.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-zinc-900 dark:text-zinc-300"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description..."
                rows={4}
                {...register("description")}
                className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 resize-none"
              />
              {errors.description && (
                <p className="text-xs font-medium text-red-650 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-900 dark:text-zinc-300">Image</Label>

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
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="image-file"
                    className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full py-4"
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                    ) : (
                      <Upload className="h-8 w-8 text-zinc-400" />
                    )}
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {uploadingImage
                        ? "Uploading image..."
                        : "Upload an image"}
                    </span>
                    <span className="text-xs text-zinc-500">
                      PNG, JPG, GIF up to 5MB
                    </span>
                  </label>
                </div>
              )}
              {imageError && (
                <p className="text-xs font-medium text-red-650 dark:text-red-400">
                  {imageError}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-3">
              <Link
                href="/dashboard/categories?tab=category-management"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900",
                  isSubmitting && "pointer-events-none opacity-50",
                )}
              >
                Cancel
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting || uploadingImage}
                className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Category"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
