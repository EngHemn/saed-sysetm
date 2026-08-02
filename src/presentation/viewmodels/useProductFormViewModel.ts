import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProductInput } from "@/domain/schemas/product";
import { useProducts, useProduct } from "@/presentation/hooks/useProducts";
import { useCategories } from "@/presentation/hooks/useCategories";
import { useLanguage } from "@/presentation/components/language-provider";
import { useImageUpload } from "@/presentation/hooks/useImageUpload";

export const productFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  image: z.string().url("Invalid image URL").nullable().optional().or(z.literal("")),
  initPrice: z.number({ message: "Price is required" }).min(0, "Initial price must be at least 0"),
  middlePrice: z.number({ message: "Price is required" }).min(0, "Middle price must be at least 0"),
  finalPrice: z.number({ message: "Price is required" }).min(0, "Final price must be at least 0"),
  brand: z.string().nullable().optional(),
  categoryId: z.string().min(1, "Category is required"),
  actionAlert: z.boolean(),
  info: z.array(
    z.object({
      title: z.string().min(1, "Specification title is required"),
      description: z.string().min(1, "Specification description is required"),
    })
  ),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

export function useProductFormViewModel(id?: string) {
  const router = useRouter();
  const isEditMode = !!id;
  const { t, dir } = useLanguage();

  const { createProduct, isCreating } = useProducts();
  const { product, isLoading: isFetching, updateProduct, isUpdating } = useProduct(id);
  const { categories, isLoading: isLoadingCategories } = useCategories();

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

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      initPrice: undefined as unknown as number,
      middlePrice: undefined as unknown as number,
      finalPrice: undefined as unknown as number,
      brand: "",
      categoryId: "",
      actionAlert: false,
      info: [],
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState } = form;

  const imageUrl = watch("image");
  const selectedCategoryId = watch("categoryId");
  const selectedBrand = watch("brand");
  const infoList = watch("info") || [];

  const [infoTitle, setInfoTitle] = useState("");
  const [infoDescription, setInfoDescription] = useState("");

  const addInfoItem = useCallback(() => {
    const trimmedTitle = infoTitle.trim();
    const trimmedDesc = infoDescription.trim();

    if (trimmedTitle && trimmedDesc) {
      setValue(
        "info",
        [
          ...infoList,
          {
            title: trimmedTitle,
            description: trimmedDesc,
          },
        ],
        { shouldValidate: true }
      );
      setInfoTitle("");
      setInfoDescription("");
    }
  }, [infoTitle, infoDescription, infoList, setValue]);

  const removeInfoItem = useCallback(
    (indexToRemove: number) => {
      setValue(
        "info",
        infoList.filter((_, i) => i !== indexToRemove),
        { shouldValidate: true }
      );
    },
    [infoList, setValue]
  );

  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );
  const categoryBrands = useMemo(() => selectedCategory?.brand || [], [selectedCategory]);

  useEffect(() => {
    if (product) {
      let title = "";
      try {
        const parsedTitle = JSON.parse(product.title);
        title = parsedTitle.en || parsedTitle.ku || product.title;
      } catch {
        title = product.title;
      }

      let description = "";
      if (product.description) {
        try {
          const parsedDesc = JSON.parse(product.description);
          description = parsedDesc.en || parsedDesc.ku || product.description;
        } catch {
          description = product.description;
        }
      }

      const specificationsList = (
        (product.info as Array<{ title: string; description: string }>) || []
      ).map((item) => {
        let itemTitle = "";
        try {
          const parsedItemTitle = JSON.parse(item.title);
          itemTitle = parsedItemTitle.en || parsedItemTitle.ku || item.title;
        } catch {
          itemTitle = item.title;
        }

        let itemDesc = "";
        try {
          const parsedItemDesc = JSON.parse(item.description);
          itemDesc = parsedItemDesc.en || parsedItemDesc.ku || item.description;
        } catch {
          itemDesc = item.description;
        }

        return {
          title: itemTitle,
          description: itemDesc,
        };
      });

      reset({
        title,
        description,
        image: product.image || "",
        initPrice: product.initPrice,
        middlePrice: product.middlePrice,
        finalPrice: product.finalPrice,
        brand: product.brand || "",
        categoryId: product.categoryId,
        actionAlert: product.actionAlert,
        info: specificationsList,
      });
    }
  }, [product, reset]);



  const removeImage = useCallback(() => {
    setValue("image", "", { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (data: ProductFormInput) => {
    const apiData: ProductInput = {
      title: JSON.stringify({ en: data.title, ku: data.title }),
      description: JSON.stringify({ en: data.description || "", ku: data.description || "" }),
      image: data.image,
      initPrice: Number(data.initPrice),
      middlePrice: Number(data.middlePrice),
      finalPrice: Number(data.finalPrice),
      brand: data.brand,
      categoryId: data.categoryId,
      actionAlert: data.actionAlert,
      info: data.info.map((item) => ({
        title: JSON.stringify({ en: item.title, ku: item.title }),
        description: JSON.stringify({ en: item.description, ku: item.description }),
      })),
    };

    try {
      if (isEditMode && id) {
        await updateProduct(apiData);
      } else {
        await createProduct(apiData);
      }
      router.push("/dashboard/products?tab=product-management");
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const getValidationError = (message: string | undefined) => {
    if (!message) return undefined;
    if (message === "Title is required")
      return t("title_required", { defaultValue: "Title is required" });
    if (message === "Category is required") return t("category_required");
    if (message === "Price is required" || message === "Initial price must be at least 0") return t("init_price_min");
    if (message === "Middle price must be at least 0") return t("middle_price_min");
    if (message === "Final price must be at least 0") return t("final_price_min");
    return t(message);
  };

  const isSubmitting = isCreating || isUpdating;

  return {
    isEditMode,
    isFetching,
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
    selectedCategoryId,
    selectedBrand,
    selectedCategory,
    categoryBrands,
    categories,
    isLoadingCategories,
    infoList,
    infoTitle,
    setInfoTitle,
    infoDescription,
    setInfoDescription,
    addInfoItem,
    removeInfoItem,
    handleImageUpload,
    removeImage,
    getValidationError,
    t,
    dir,
  };
}

export function useAddProductViewModel() {
  return useProductFormViewModel(undefined);
}

export function useEditProductViewModel(id: string) {
  return useProductFormViewModel(id);
}
