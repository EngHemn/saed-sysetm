import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryInput } from "@/domain/schemas/category";
import { useCategories, useCategory } from "@/presentation/hooks/useCategories";
import { useLanguage } from "@/presentation/components/language-provider";

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

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
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
        const msg = err instanceof Error ? err.message : "An error occurred during upload";
        setImageError(msg);
      } finally {
        setUploadingImage(false);
      }
    },
    [setValue]
  );

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
    uploadingImage,
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
