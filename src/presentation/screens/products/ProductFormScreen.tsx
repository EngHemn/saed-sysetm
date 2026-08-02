"use client";

import React from "react";
import { Upload, Loader2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useProductFormViewModel } from "@/presentation/viewmodels/useProductFormViewModel";
import { ProductFormHeader } from "./components/ProductFormHeader";
import { ProductFormBasicSection } from "./components/ProductFormBasicSection";
import { ProductFormSpecsSection } from "./components/ProductFormSpecsSection";

interface ProductFormScreenProps {
  id?: string;
}

export function ProductFormScreen({ id }: ProductFormScreenProps) {
  const viewModel = useProductFormViewModel(id);

  if (viewModel.isEditMode && viewModel.isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto" dir={viewModel.dir}>
      <ProductFormHeader
        isEditMode={viewModel.isEditMode}
        dir={viewModel.dir}
        t={viewModel.t}
      />

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 text-start">
            {viewModel.t("product_info")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={viewModel.handleSubmit} className="space-y-5">
            <ProductFormBasicSection
              register={viewModel.register}
              setValue={viewModel.setValue}
              errors={viewModel.errors}
              selectedCategoryId={viewModel.selectedCategoryId}
              selectedBrand={viewModel.selectedBrand}
              selectedCategory={viewModel.selectedCategory}
              categoryBrands={viewModel.categoryBrands}
              categories={viewModel.categories}
              isLoadingCategories={viewModel.isLoadingCategories}
              getValidationError={viewModel.getValidationError}
              t={viewModel.t}
            />

            <ProductFormSpecsSection
              infoList={viewModel.infoList}
              infoTitle={viewModel.infoTitle}
              setInfoTitle={viewModel.setInfoTitle}
              infoDescription={viewModel.infoDescription}
              setInfoDescription={viewModel.setInfoDescription}
              addInfoItem={viewModel.addInfoItem}
              removeInfoItem={viewModel.removeInfoItem}
              dir={viewModel.dir}
              t={viewModel.t}
            />

            <div className="space-y-2">
              <Label className="text-zinc-900 dark:text-zinc-300 text-start block">
                {viewModel.t("image")}
              </Label>
              {viewModel.imageUrl ? (
                <div className="relative h-64 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden group">
                  <Image
                    src={viewModel.imageUrl}
                    alt="Uploaded product image"
                    className="h-full w-full object-cover"
                    width={300}
                    height={300}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={viewModel.removeImage}
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
                    onChange={viewModel.handleImageUpload}
                    className="hidden"
                    disabled={viewModel.isImageLoading}
                  />
                  <label
                    htmlFor="product-image-file"
                    className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full py-4"
                  >
                    {viewModel.isImageLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                    ) : (
                      <Upload className="h-8 w-8 text-zinc-400" />
                    )}
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {viewModel.isCompressing
                        ? viewModel.t("compressing_image", {
                            defaultValue: "Compressing image...",
                          })
                        : viewModel.uploadingImage
                        ? viewModel.t("uploading_image", {
                            defaultValue: "Uploading image...",
                          })
                        : viewModel.t("upload_image", {
                            defaultValue: "Upload an image",
                          })}
                    </span>
                    <span className="text-xs text-zinc-500">
                      PNG, JPG, WebP (auto-optimized 400-500 KB)
                    </span>
                  </label>
                </div>
              )}
              {viewModel.imageError && (
                <p className="text-xs font-medium text-red-655 dark:text-red-400 text-start">
                  {viewModel.imageError}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="actionAlert"
                {...viewModel.register("actionAlert")}
                className="h-4 w-4 rounded-sm border border-zinc-300 dark:border-zinc-850"
              />
              <Label
                htmlFor="actionAlert"
                className="text-zinc-900 dark:text-zinc-300 cursor-pointer"
              >
                {viewModel.t("action_alert_desc")}
              </Label>
            </div>

            <div
              className={`pt-4 border-t border-zinc-150 dark:border-zinc-900 flex ${
                viewModel.dir === "rtl" ? "justify-start" : "justify-end"
              } gap-3`}
            >
              <Link
                href="/dashboard/products?tab=product-management"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50",
                  viewModel.isSubmitting && "pointer-events-none opacity-50"
                )}
              >
                {viewModel.t("cancel")}
              </Link>
              <Button
                type="submit"
                disabled={viewModel.isSubmitting || viewModel.isImageLoading}
                className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200"
              >
                {viewModel.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {viewModel.t("updating")}
                  </>
                ) : (
                  viewModel.t("save")
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
