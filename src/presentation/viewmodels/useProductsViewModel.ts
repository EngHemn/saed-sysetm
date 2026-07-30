import { useState, useEffect, useMemo, useCallback } from "react";
import { useProducts, useProduct } from "@/presentation/hooks/useProducts";
import { useCategories } from "@/presentation/hooks/useCategories";
import { useLanguage } from "@/presentation/components/language-provider";

export function useProductsViewModel() {
  const { t, dir, language } = useLanguage();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("all");
  const [selectedAlertFilter, setSelectedAlertFilter] = useState<
    "all" | "alert" | "no_alert"
  >("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedQuery,
    selectedCategoryFilter,
    selectedBrandFilter,
    selectedAlertFilter,
  ]);

  const {
    products,
    total,
    isLoading,
    error,
    toggleActionAlert,
    isTogglingAlert,
    togglingAlertId,
  } = useProducts({
    search: debouncedQuery,
    categoryId:
      selectedCategoryFilter !== "all" ? selectedCategoryFilter : undefined,
    brand: selectedBrandFilter !== "all" ? selectedBrandFilter : undefined,
    actionAlert:
      selectedAlertFilter === "alert"
        ? true
        : selectedAlertFilter === "no_alert"
          ? false
          : undefined,
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  const { categories } = useCategories();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { deleteProduct, isDeleting } = useProduct(deleteTargetId || undefined);

  const handleToggleAlert = useCallback(
    async (productId: string, currentAlertStatus: boolean) => {
      try {
        await toggleActionAlert({
          id: productId,
          actionAlert: !currentAlertStatus,
        });
      } catch (err: unknown) {
        console.error(err);
      }
    },
    [toggleActionAlert],
  );

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryFilter),
    [categories, selectedCategoryFilter],
  );

  const brandOptions = useMemo(() => {
    if (selectedCategory) return selectedCategory.brand || [];
    return Array.from(new Set(categories.flatMap((c) => c.brand || [])));
  }, [selectedCategory, categories]);

  const clearFilters = useCallback(() => {
    setSelectedCategoryFilter("all");
    setSelectedBrandFilter("all");
    setSelectedAlertFilter("all");
    setSearchQuery("");
    setPage(1);
  }, []);

  const handleSort = useCallback(
    (field: string) => {
      if (sortBy === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(field);
        setSortOrder("asc");
      }
      setPage(1);
    },
    [sortBy, sortOrder],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    try {
      await deleteProduct();
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, deleteProduct]);

  return {
    t,
    dir,
    language,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    perPage,
    setPerPage,
    sortBy,
    sortOrder,
    handleSort,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedBrandFilter,
    setSelectedBrandFilter,
    selectedAlertFilter,
    setSelectedAlertFilter,
    products,
    total,
    categories,
    brandOptions,
    isLoading,
    error,
    handleToggleAlert,
    isTogglingAlert,
    togglingAlertId,
    deleteTargetId,
    setDeleteTargetId,
    handleDelete,
    isDeleting,
    clearFilters,
  };
}
