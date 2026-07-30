"use client";

import React from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ProductFormImageSectionProps {
  imageUrl?: string | null;
  uploadingImage: boolean;
  imageError: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeImage: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function ProductFormImageSection({
  imageUrl,
  uploadingImage,
  imageError,
  handleImageUpload,
  removeImage,
  t,
}: ProductFormImageSectionProps) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-900 dark:text-zinc-300 text-left block">
        {t("image")}
      </Label>
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
              {uploadingImage
                ? t("uploading_image", { defaultValue: "Uploading image..." })
                : t("upload_image", { defaultValue: "Upload logo" })}
            </span>
          </label>
        </div>
      )}
      {imageError && (
        <p className="text-xs font-medium text-red-555 dark:text-red-400 text-left">
          {imageError}
        </p>
      )}
    </div>
  );
}
