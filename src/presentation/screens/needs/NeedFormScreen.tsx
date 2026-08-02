"use client";

import React from "react";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useNeedFormViewModel } from "@/presentation/viewmodels/useNeedFormViewModel";

interface NeedFormScreenProps {
  id?: string;
}

export function NeedFormScreen({ id }: NeedFormScreenProps) {
  const {
    isEditMode,
    isLoadingData,
    register,
    handleSubmit,
    setValue,
    errors,
    isSubmitting,
    isCompressing,
    uploadingImage,
    isImageLoading,
    imageError,
    imageUrl,
    selectedPriority,
    handleImageUpload,
    removeImage,
    getValidationError,
    t,
    dir,
  } = useNeedFormViewModel(id);

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" dir={dir}>
        <Loader2 className="h-8 w-8 animate-spin text-zinc-550 shrink-0" />
      </div>
    );
  }


  return (
    <div className="space-y-6 max-w-2xl mx-auto" dir={dir}>
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/needs?tab=needs-management"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9 text-zinc-650 dark:text-zinc-400 flex items-center justify-center"
          )}
        >
          <ArrowLeft className={cn("h-5 w-5", dir === "rtl" && "rotate-180")} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-550 text-start">
            {isEditMode ? t("edit_need") : t("add_need")}
          </h1>
          <p className="text-sm text-zinc-555 dark:text-zinc-400 text-start">
            {isEditMode ? t("edit_need_desc", { defaultValue: "Update details of the need request" }) : t("add_need_desc", { defaultValue: "Create a new need request" })}
          </p>
        </div>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-550 text-start">
            {t("need_details")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-900 dark:text-zinc-300 text-start block">
                {t("need_item")} <span className="text-red-555">*</span>
              </Label>
              <Input
                id="title"
                placeholder={t("need_item_placeholder", { defaultValue: "e.g. Need stock for Premium Oil" })}
                {...register("title")}
                className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 text-start"
              />
              {errors.title && (
                <p className="text-xs font-medium text-red-655 dark:text-red-400 text-start">
                  {getValidationError(errors.title.message)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-zinc-900 dark:text-zinc-300 text-start block">
                {t("priority")} <span className="text-red-555">*</span>
              </Label>
              <Select
                value={selectedPriority}
                onValueChange={(val) => setValue("priority", val as "Low" | "Medium" | "High", { shouldValidate: true })}
              >
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-start">
                  <SelectValue placeholder={t("priority")} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <SelectItem value="Low">{t("low")}</SelectItem>
                  <SelectItem value="Medium">{t("medium")}</SelectItem>
                  <SelectItem value="High">{t("high")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-xs font-medium text-red-655 dark:text-red-400 text-start">
                  {getValidationError(errors.priority.message)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-900 dark:text-zinc-300 text-start block">
                {t("description")}
              </Label>
              <Textarea
                id="description"
                placeholder={t("description_placeholder", { defaultValue: "Describe why this is needed, quantities required, etc..." })}
                rows={4}
                {...register("description")}
                className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-955 dark:focus-visible:ring-zinc-300 resize-none text-start"
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
                <div className="relative h-64 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden group bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                  <Image
                    src={imageUrl}
                    alt="Uploaded attachment"
                    className="h-full w-full object-contain"
                    width={300}
                    height={300}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={removeImage}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-90 hover:opacity-100 shadow-sm cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-all">
                  <input
                    type="file"
                    id="need-image-file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isImageLoading}
                  />
                  <label
                    htmlFor="need-image-file"
                    className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full py-4"
                  >
                    {isImageLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-zinc-500 shrink-0" />
                    ) : (
                      <Upload className="h-8 w-8 text-zinc-400 shrink-0" />
                    )}
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 text-center">
                      {isCompressing
                        ? t("compressing_image", { defaultValue: "Compressing image..." })
                        : uploadingImage
                        ? t("uploading_image", { defaultValue: "Uploading image..." })
                        : t("upload_image", { defaultValue: "Upload image" })}
                    </span>
                    <span className="text-xs text-zinc-555">PNG, JPG, WebP (auto-optimized 400-500 KB)</span>
                  </label>
                </div>
              )}
              {imageError && (
                <p className="text-xs font-medium text-red-655 dark:text-red-400 text-start">
                  {imageError}
                </p>
              )}
            </div>

            <div className={`pt-4 border-t border-zinc-100 dark:border-zinc-900 flex ${dir === "rtl" ? "justify-start" : "justify-end"} gap-3`}>
              <Link
                href="/dashboard/needs?tab=needs-management"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-zinc-200 dark:border-zinc-800 text-zinc-955 dark:text-zinc-550 hover:bg-zinc-50",
                  isSubmitting && "pointer-events-none opacity-50"
                )}
              >
                {t("cancel")}
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting || isImageLoading}
                className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-955 hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2 shrink-0" />
                    {t("saving", { defaultValue: "Saving..." })}
                  </>
                ) : (
                  t("save")
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
