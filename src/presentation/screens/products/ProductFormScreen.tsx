"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import Link from "next/link";
import { productSchema, ProductInput } from "@/domain/schemas/product";
import { useProducts, useProduct } from "@/presentation/hooks/useProducts";
import { useCategories } from "@/presentation/hooks/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProductFormScreenProps {
  id?: string;
}

export function ProductFormScreen({ id }: ProductFormScreenProps) {
  const router = useRouter();
  const isEditMode = !!id;

  const { createProduct, isCreating } = useProducts();
  const { product, isLoading: isFetching, updateProduct, isUpdating } = useProduct(id);
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
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
  const infoList = watch("info") || [];

  const [infoTitle, setInfoTitle] = useState("");
  const [infoDescription, setInfoDescription] = useState("");

  const addInfoItem = () => {
    const trimmedTitle = infoTitle.trim();
    const trimmedDesc = infoDescription.trim();
    if (trimmedTitle && trimmedDesc) {
      setValue("info", [...infoList, { title: trimmedTitle, description: trimmedDesc }], { shouldValidate: true });
      setInfoTitle("");
      setInfoDescription("");
    }
  };

  const removeInfoItem = (indexToRemove: number) => {
    setValue(
      "info",
      infoList.filter((_, i) => i !== indexToRemove),
      { shouldValidate: true }
    );
  };

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
  const categoryBrands = selectedCategory?.brand || [];

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description || "",
        image: product.image || "",
        initPrice: product.initPrice,
        middlePrice: product.middlePrice,
        finalPrice: product.finalPrice,
        brand: product.brand || "",
        categoryId: product.categoryId,
        actionAlert: product.actionAlert,
        info: (product.info as { title: string; description: string }[]) || [],
      });
    }
  }, [product, reset]);

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

  const onSubmit = async (data: ProductInput) => {
    try {
      if (isEditMode && id) {
        await updateProduct(data);
      } else {
        await createProduct(data);
      }
      router.push("/dashboard/products?tab=product-management");
    } catch (err: unknown) {
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
          href="/dashboard/products?tab=product-management"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9 text-zinc-600 dark:text-zinc-400 flex items-center justify-center"
          )}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {isEditMode ? "Edit Product" : "Add Product"}
          </h1>
          <p className="text-sm text-zinc-555 dark:text-zinc-400">
            {isEditMode
              ? "Update product pricing and inventory details"
              : "Create a new product in the store"}
          </p>
        </div>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Product Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-900 dark:text-zinc-300">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Premium Beard Oil"
                {...register("title")}
                className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
              />
              {errors.title && (
                <p className="text-xs font-medium text-red-655 dark:text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-zinc-900 dark:text-zinc-300">
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
                    <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
                      <SelectValue placeholder="Select Category">
                        {selectedCategory?.title}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.categoryId && (
                  <p className="text-xs font-medium text-red-655 dark:text-red-400">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="text-zinc-900 dark:text-zinc-300">
                  Brand (Optional)
                </Label>
                {categoryBrands.length > 0 ? (
                  <Select
                    value={selectedBrand || ""}
                    onValueChange={(val) => setValue("brand", val || "", { shouldValidate: true })}
                  >
                    <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
                      <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
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
                    id="brand"
                    placeholder="Enter brand name"
                    {...register("brand")}
                    className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initPrice" className="text-zinc-900 dark:text-zinc-300">
                  Initial Price ($) <span className="text-red-500">*</span>
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
                  <p className="text-xs font-medium text-red-655 dark:text-red-400">
                    {errors.initPrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middlePrice" className="text-zinc-900 dark:text-zinc-300">
                  Middle Price ($) <span className="text-red-500">*</span>
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
                  <p className="text-xs font-medium text-red-655 dark:text-red-400">
                    {errors.middlePrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="finalPrice" className="text-zinc-900 dark:text-zinc-300">
                  Final Price ($) <span className="text-red-500">*</span>
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
                  <p className="text-xs font-medium text-red-655 dark:text-red-400">
                    {errors.finalPrice.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-900 dark:text-zinc-300">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter product details and highlights..."
                rows={4}
                {...register("description")}
                className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 resize-none"
              />
            </div>

            <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-900 pt-4">
              <Label className="text-zinc-900 dark:text-zinc-300 font-semibold">
                Product Specifications
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Input
                    placeholder="Info title (e.g. Volume)"
                    value={infoTitle}
                    onChange={(e) => setInfoTitle(e.target.value)}
                    className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800"
                  />
                </div>
                <div className="space-y-1.5 flex gap-2">
                  <Input
                    placeholder="Info description (e.g. 100ml)"
                    value={infoDescription}
                    onChange={(e) => setInfoDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInfoItem();
                      }
                    }}
                    className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addInfoItem}
                    variant="outline"
                    className="border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {infoList.length > 0 && (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/10">
                  <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                    <thead className="bg-zinc-50 dark:bg-zinc-900/30">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider w-16">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                      {infoList.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-150">
                            {item.title}
                          </td>
                          <td className="px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                            {item.description}
                          </td>
                          <td className="px-4 py-2 text-right text-sm font-medium">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInfoItem(idx)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-7 px-2"
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-900 dark:text-zinc-300">Product Image</Label>

              {imageUrl ? (
                <div className="relative h-64 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden group">
                  <Image
                    src={imageUrl}
                    alt="Uploaded product image"
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
                    id="product-image-file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="product-image-file"
                    className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full py-4"
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                    ) : (
                      <Upload className="h-8 w-8 text-zinc-400" />
                    )}
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {uploadingImage ? "Uploading image..." : "Upload an image"}
                    </span>
                    <span className="text-xs text-zinc-500">PNG, JPG, GIF up to 5MB</span>
                  </label>
                </div>
              )}
              {imageError && (
                <p className="text-xs font-medium text-red-655 dark:text-red-400">
                  {imageError}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-3">
              <Link
                href="/dashboard/products?tab=product-management"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50",
                  isSubmitting && "pointer-events-none opacity-50"
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
                  "Save Product"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
