"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { companySchema, CompanyInput } from "@/domain/schemas/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "./language-provider";

interface CompanyFormProps {
  initialValues?: Partial<CompanyInput>;
  onSubmit: (data: CompanyInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function CompanyForm({ initialValues, onSubmit, onCancel, isSubmitting }: CompanyFormProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const { t, dir } = useLanguage();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: initialValues?.name || "",
      phone: initialValues?.phone || "",
      image: initialValues?.image || "",
      address: initialValues?.address || "",
      note: initialValues?.note || "",
    },
  });

  const imageUrl = watch("image");

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

  const getValidationError = (message: string | undefined) => {
    if (!message) return undefined;
    if (message === "Company name is required") return t("company_name_required");
    if (message === "Phone number is required") return t("phone_required");
    return t(message);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir={dir}>
      <div className="space-y-2">
        <Label htmlFor="company-name" className="text-zinc-900 dark:text-zinc-300 text-left block">
          {t("company_name", { defaultValue: "Company Name" })} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="company-name"
          placeholder={t("company_name", { defaultValue: "Company Name" })}
          {...register("name")}
          className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-left animate-none"
        />
        {errors.name && (
          <p className="text-xs font-medium text-red-555 dark:text-red-400 text-left animate-none">
            {getValidationError(errors.name.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-phone" className="text-zinc-900 dark:text-zinc-300 text-left block">
          {t("phone", { defaultValue: "Phone Number" })} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="company-phone"
          placeholder={t("phone", { defaultValue: "Phone Number" })}
          {...register("phone")}
          className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-left animate-none"
        />
        {errors.phone && (
          <p className="text-xs font-medium text-red-555 dark:text-red-400 text-left animate-none">
            {getValidationError(errors.phone.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-address" className="text-zinc-900 dark:text-zinc-300 text-left block">
          {t("address", { defaultValue: "Address" })}
        </Label>
        <Input
          id="company-address"
          placeholder={t("address", { defaultValue: "Address" })}
          {...register("address")}
          className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-left animate-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-note" className="text-zinc-900 dark:text-zinc-300 text-left block">
          {t("note")}
        </Label>
        <Textarea
          id="company-note"
          placeholder={t("note")}
          rows={3}
          {...register("note")}
          className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 resize-none text-left animate-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-900 dark:text-zinc-300 text-left block">
          {t("image")}
        </Label>
        {imageUrl ? (
          <div className="relative h-40 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
            <Image
              src={imageUrl}
              alt="Company Logo"
              className="h-full w-full object-contain"
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
              id="company-image-file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
            <label
              htmlFor="company-image-file"
              className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full py-2"
            >
              {uploadingImage ? (
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
              ) : (
                <Upload className="h-6 w-6 text-zinc-400" />
              )}
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {uploadingImage ? t("uploading_image", { defaultValue: "Uploading..." }) : t("upload_image", { defaultValue: "Upload logo" })}
              </span>
            </label>
          </div>
        )}
        {imageError && (
          <p className="text-xs font-medium text-red-555 dark:text-red-400 text-left animate-none">
            {imageError}
          </p>
        )}
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
