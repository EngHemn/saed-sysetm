"use client";

import React from "react";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface BillFormImageUploadProps {
  imageUrl?: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeImage: () => void;
  uploadingImage: boolean;
  imageError: string | null;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillFormImageUpload({
  imageUrl,
  handleImageUpload,
  removeImage,
  uploadingImage,
  imageError,
  t,
}: BillFormImageUploadProps) {
  return (
    <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
      <Label className="text-zinc-900 dark:text-zinc-300 font-semibold text-left block">
        {t("bill_image", { defaultValue: "Bill / Receipt Image" })}
      </Label>

      {imageUrl ? (
        <div className="relative h-64 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden group bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
          <Image
            src={imageUrl}
            alt="Uploaded bill receipt"
            className="h-full w-full object-contain"
            width={400}
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
            id="bill-image-file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploadingImage}
          />
          <label
            htmlFor="bill-image-file"
            className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full py-4"
          >
            {uploadingImage ? (
              <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            ) : (
              <Upload className="h-8 w-8 text-zinc-400" />
            )}
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 text-center">
              {uploadingImage
                ? t("uploading_image", { defaultValue: "Uploading image..." })
                : t("upload_image", {
                    defaultValue: "Upload bill / receipt image",
                  })}
            </span>
            <span className="text-xs text-zinc-500">
              PNG, JPG, GIF up to 5MB
            </span>
          </label>
        </div>
      )}
      {imageError && (
        <p className="text-xs font-medium text-red-655 dark:text-red-400 text-left">
          {imageError}
        </p>
      )}
    </div>
  );
}
