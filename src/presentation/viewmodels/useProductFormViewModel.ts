import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProductInput } from "@/domain/schemas/product";
import { useProducts, useProduct } from "@/presentation/hooks/useProducts";
import { useCategories } from "@/presentation/hooks/useCategories";
import { useLanguage } from "@/presentation/components/language-provider";

export const productFormSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ku: z.string().min(1, "Kurdish title is required"),
  description_en: z.string().nullable().optional(),
  description_ku: z.string().nullable().optional(),
  image: z.string().url("Invalid image URL").nullable().optional().or(z.literal("")),
  initPrice: z.number().min(0, "Initial price must be at least 0"),
  middlePrice: z.number().min(0, "Middle price must be at least 0"),
  finalPrice: z.number().min(0, "Final price must be at least 0"),
  brand: z.string().nullable().optional(),
  categoryId: z.string().min(1, "Category is required"),
  actionAlert: z.boolean(),
  info: z.array(
    z.object({
      title_en: z.string().min(1, "Specification title is required"),
      title_ku: z.string().min(1, "Specification title is required"),
      description_en: z.string().min(1, "Specification description is required"),
      description_ku: z.string().min(1, "Specification description is required"),
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

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title_en: "",
      title_ku: "",
      description_en: "",
      description_ku: "",
      image: "",
      initPrice: 0,
      middlePrice: 0,
      finalPrice: 0,
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

  const [infoTitleEn, setInfoTitleEn] = useState("");
  const [infoTitleKu, setInfoTitleKu] = useState("");
  const [infoDescriptionEn, setInfoDescriptionEn] = useState("");
  const [infoDescriptionKu, setInfoDescriptionKu] = useState("");

  const addInfoItem = useCallback(() => {
    const trimmedTitleEn = infoTitleEn.trim();
    const trimmedTitleKu = infoTitleKu.trim();
    const trimmedDescEn = infoDescriptionEn.trim();
    const trimmedDescKu = infoDescriptionKu.trim();

    if (trimmedTitleEn && trimmedTitleKu && trimmedDescEn && trimmedDescKu) {
      setValue(
        "info",
        [
          ...infoList,
          {
            title_en: trimmedTitleEn,
            title_ku: trimmedTitleKu,
            description_en: trimmedDescEn,
            description_ku: trimmedDescKu,
          },
        ],
        { shouldValidate: true }
      );
      setInfoTitleEn("");
      setInfoTitleKu("");
      setInfoDescriptionEn("");
      setInfoDescriptionKu("");
    }
  }, [infoTitleEn, infoTitleKu, infoDescriptionEn, infoDescriptionKu, infoList, setValue]);

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
      let title_en = "";
      let title_ku = "";
      try {
        const parsedTitle = JSON.parse(product.title);
        title_en = parsedTitle.en || "";
        title_ku = parsedTitle.ku || "";
      } catch {
        title_en = product.title;
        title_ku = product.title;
      }

      let description_en = "";
      let description_ku = "";
      if (product.description) {
        try {
          const parsedDesc = JSON.parse(product.description);
          description_en = parsedDesc.en || "";
          description_ku = parsedDesc.ku || "";
        } catch {
          description_en = product.description;
          description_ku = product.description;
        }
      }

      const specificationsList = (
        (product.info as Array<{ title: string; description: string }>) || []
      ).map((item) => {
        let itemTitleEn = "";
        let itemTitleKu = "";
        try {
          const parsedItemTitle = JSON.parse(item.title);
          itemTitleEn = parsedItemTitle.en || "";
          itemTitleKu = parsedItemTitle.ku || "";
        } catch {
          itemTitleEn = item.title;
          itemTitleKu = item.title;
        }

        let itemDescEn = "";
        let itemDescKu = "";
        try {
          const parsedItemDesc = JSON.parse(item.description);
          itemDescEn = parsedItemDesc.en || "";
          itemDescKu = parsedItemDesc.ku || "";
        } catch {
          itemDescEn = item.description;
          itemDescKu = item.description;
        }

        return {
          title_en: itemTitleEn,
          title_ku: itemTitleKu,
          description_en: itemDescEn,
          description_ku: itemDescKu,
        };
      });

      reset({
        title_en,
        title_ku,
        description_en,
        description_ku,
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

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [setValue]);

  const removeImage = useCallback(() => {
    setValue("image", "", { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (data: ProductFormInput) => {
    const apiData: ProductInput = {
      title: JSON.stringify({ en: data.title_en, ku: data.title_ku }),
      description: JSON.stringify({ en: data.description_en || "", ku: data.description_ku || "" }),
      image: data.image,
      initPrice: data.initPrice,
      middlePrice: data.middlePrice,
      finalPrice: data.finalPrice,
      brand: data.brand,
      categoryId: data.categoryId,
      actionAlert: data.actionAlert,
      info: data.info.map((item) => ({
        title: JSON.stringify({ en: item.title_en, ku: item.title_ku }),
        description: JSON.stringify({ en: item.description_en, ku: item.description_ku }),
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
    if (message === "English title is required")
      return t("title_required_en", { defaultValue: "English title is required" });
    if (message === "Kurdish title is required")
      return t("title_required_ku", { defaultValue: "Kurdish title is required" });
    if (message === "Category is required") return t("category_required");
    if (message === "Initial price must be at least 0") return t("init_price_min");
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
    uploadingImage,
    imageError,
    imageUrl,
    selectedCategoryId,
    selectedBrand,
    selectedCategory,
    categoryBrands,
    categories,
    isLoadingCategories,
    infoList,
    infoTitleEn,
    setInfoTitleEn,
    infoTitleKu,
    setInfoTitleKu,
    infoDescriptionEn,
    setInfoDescriptionEn,
    infoDescriptionKu,
    setInfoDescriptionKu,
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
