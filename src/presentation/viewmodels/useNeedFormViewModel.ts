import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { needSchema, NeedInput } from "@/domain/schemas/need";
import { useNeeds, useNeed } from "@/presentation/hooks/useNeeds";
import { useProduct } from "@/presentation/hooks/useProducts";
import { getLocalizedValue } from "@/lib/utils";
import { useLanguage } from "@/presentation/components/language-provider";

export function useNeedFormViewModel(id?: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = !!id;
  const { t, dir, language } = useLanguage();

  const productIdParam = searchParams ? searchParams.get("productId") || "" : "";

  const { createNeed, isCreating } = useNeeds();
  const { need, isLoading: isFetchingNeed, updateNeed, isUpdating } = useNeed(id);
  const { product, isLoading: isFetchingProduct } = useProduct(productIdParam || undefined);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

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

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [setValue]
  );

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
    uploadingImage,
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
