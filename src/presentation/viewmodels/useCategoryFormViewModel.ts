import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryInput } from "@/domain/schemas/category";
import { useCategories, useCategory } from "@/presentation/hooks/useCategories";
import { useLanguage } from "@/presentation/components/language-provider";
import { useImageUpload } from "@/presentation/hooks/useImageUpload";

export function useCategoryFormViewModel(id?: string) {
  const router = useRouter();
  const isEditMode = !!id;
  const { t, dir } = useLanguage();
  const { createCategory, isCreating } = useCategories();
  const {
    category,
    isLoading: isFetching,
    updateCategory,
    isUpdating,
  } = useCategory(id);

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
  const [brandInput, setBrandInput] = useState("");

  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
      image: "",
      description: "",
      brand: [],
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState } = form;

  const imageUrl = watch("image");
  const brands = watch("brand") || [];

  const addBrand = useCallback(() => {
    const trimmed = brandInput.trim();
    if (trimmed && !brands.includes(trimmed)) {
      setValue("brand", [...brands, trimmed], { shouldValidate: true });
      setBrandInput("");
    }
  }, [brandInput, brands, setValue]);

  const removeBrand = useCallback(
    (indexToRemove: number) => {
      setValue(
        "brand",
        brands.filter((_, i) => i !== indexToRemove),
        { shouldValidate: true }
      );
    },
    [brands, setValue]
  );

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



  const removeImage = useCallback(() => {
    setValue("image", "", { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (data: CategoryInput) => {
    try {
      if (isEditMode && id) {
        await updateCategory(data);
      } else {
        await createCategory(data);
      }
      router.push("/dashboard/categories?tab=category-management");
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const getValidationError = (message: string | undefined) => {
    if (!message) return undefined;
    if (message === "Title is required") return t("title_required");
    return t(message);
  };

  const isSubmitting = isCreating || isUpdating;

  return {
    isEditMode,
    isFetching,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors: formState.errors,
    isSubmitting,
    isCompressing,
    uploadingImage,
    isImageLoading,
    imageError,
    imageUrl,
    brands,
    brandInput,
    setBrandInput,
    addBrand,
    removeBrand,
    handleImageUpload,
    removeImage,
    getValidationError,
    t,
    dir,
  };
}

export function useAddCategoryViewModel() {
  return useCategoryFormViewModel(undefined);
}

export function useEditCategoryViewModel(id: string) {
  return useCategoryFormViewModel(id);
}
