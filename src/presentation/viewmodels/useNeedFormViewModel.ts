import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { needSchema, NeedInput } from "@/domain/schemas/need";
import { useNeeds, useNeed } from "@/presentation/hooks/useNeeds";
import { useProduct } from "@/presentation/hooks/useProducts";
import { getLocalizedValue } from "@/lib/utils";
import { useLanguage } from "@/presentation/components/language-provider";
import { useImageUpload } from "@/presentation/hooks/useImageUpload";

export function useNeedFormViewModel(id?: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = !!id;
  const { t, dir, language } = useLanguage();

  const productIdParam = searchParams ? searchParams.get("productId") || "" : "";

  const { createNeed, isCreating } = useNeeds();
  const { need, isLoading: isFetchingNeed, updateNeed, isUpdating } = useNeed(id);
  const { product, isLoading: isFetchingProduct } = useProduct(productIdParam || undefined);

  const {
    isCompressing,
    isUploading: uploadingImage,
    isLoading: isImageLoading,
    error: imageError,
    handleFileChange: handleImageUpload,
  } = useImageUpload({
    onSuccess: (url) => {
      setValue("image", url, { shouldValidate: true });
    },
  });

  const form = useForm<NeedInput>({
    resolver: zodResolver(needSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      priority: "Medium",
      productId: "",
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState } = form;

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
        title: getLocalizedValue(product.title, language),
        description: getLocalizedValue(product.description || "", language),
        image: product.image || "",
        priority: "Medium",
        productId: product.id,
      });
    }
  }, [need, product, isEditMode, reset, language]);



  const removeImage = useCallback(() => {
    setValue("image", "", { shouldValidate: true });
  }, [setValue]);

  const getValidationError = (message: string | undefined) => {
    if (!message) return undefined;
    if (message === "Title is required") return t("title_required", { defaultValue: "Title is required" });
    if (message === "Title is too long") return t("title_too_long", { defaultValue: "Title is too long" });
    if (message === "Invalid image URL") return t("invalid_image_url", { defaultValue: "Invalid image URL" });
    return t(message);
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

  return {
    isEditMode,
    isLoadingData,
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    errors: formState.errors,
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
  };
}

export function useAddNeedViewModel() {
  return useNeedFormViewModel(undefined);
}

export function useEditNeedViewModel(id: string) {
  return useNeedFormViewModel(id);
}
