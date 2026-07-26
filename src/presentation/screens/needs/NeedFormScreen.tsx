"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import Link from "next/link";
import { needSchema, NeedInput } from "@/domain/schemas/need";
import { useNeeds, useNeed } from "@/presentation/hooks/useNeeds";
import { useProduct } from "@/presentation/hooks/useProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NeedFormScreenProps {
  id?: string;
}

export function NeedFormScreen({ id }: NeedFormScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = !!id;

  const productIdParam = searchParams.get("productId") || "";

  const { createNeed, isCreating } = useNeeds();
  const { need, isLoading: isFetchingNeed, updateNeed, isUpdating } = useNeed(id);
  const { product, isLoading: isFetchingProduct } = useProduct(productIdParam || undefined);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NeedInput>({
    resolver: zodResolver(needSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      priority: "Medium",
      productId: "",
    },
  });

  const imageUrl = watch("image");
  const selectedPriority = watch("priority");

  useEffect(() => {
    if (isEditMode && need) {
      reset({
        title: need.title,
        description: need.description || "",
        image: need.image || "",
        priority: need.priority as "Low" | "Medium" | "High",
        productId: need.productId || "",
      });
    } else if (!isEditMode && product) {
      reset({
        title: product.title,
        description: product.description || "",
        image: product.image || "",
        priority: "Medium",
        productId: product.id,
      });
    }
  }, [need, product, isEditMode, reset]);

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

  const onSubmit = async (data: NeedInput) => {
    try {
      if (isEditMode && id) {
        await updateNeed(data);
      } else {
        await createNeed(data);
      }
      router.push("/dashboard/needs?tab=needs-management");
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const isSubmitting = isCreating || isUpdating;
  const isLoadingData = (isEditMode && isFetchingNeed) || (!!productIdParam && isFetchingProduct);

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-550" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/needs?tab=needs-management"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9 text-zinc-650 dark:text-zinc-400 flex items-center justify-center"
          )}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-550">
            {isEditMode ? "Edit Need" : "Add Need"}
          </h1>
          <p className="text-sm text-zinc-550 dark:text-zinc-400">
            {isEditMode ? "Update details of the need request" : "Create a new need request"}
          </p>
        </div>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Need details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-900 dark:text-zinc-300">
                Title <span className="text-red-555">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Need stock for Premium Oil"
                {...register("title")}
                className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
              />
              {errors.title && (
                <p className="text-xs font-medium text-red-655 dark:text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-zinc-900 dark:text-zinc-300">
                Priority <span className="text-red-555">*</span>
              </Label>
              <Select
                value={selectedPriority}
                onValueChange={(val) => setValue("priority", val as "Low" | "Medium" | "High", { shouldValidate: true })}
              >
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-xs font-medium text-red-655 dark:text-red-400">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-900 dark:text-zinc-300">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe why this is needed, quantities required, etc..."
                rows={4}
                {...register("description")}
                className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 resize-none"
              />
              {errors.description && (
                <p className="text-xs font-medium text-red-655 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-900 dark:text-zinc-300">Image Attachment</Label>

              {imageUrl ? (
                <div className="relative h-64 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden group">
                  <Image
                    src={imageUrl}
                    alt="Uploaded attachment"
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
                    id="need-image-file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="need-image-file"
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
                    <span className="text-xs text-zinc-555">PNG, JPG, GIF up to 5MB</span>
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
                href="/dashboard/needs?tab=needs-management"
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
                  "Save Need"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
