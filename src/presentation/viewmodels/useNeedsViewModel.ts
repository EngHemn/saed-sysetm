import { useState, useEffect, useCallback, useMemo } from "react";
import { useProducts } from "@/presentation/hooks/useProducts";
import { useNeeds, useNeed } from "@/presentation/hooks/useNeeds";
import { useLanguage } from "@/presentation/components/language-provider";

export function useNeedsViewModel() {
  const { t, dir, language } = useLanguage();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    products,
    total: totalProducts,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts({
    search: activeTab === "products" ? debouncedQuery : undefined,
    actionAlert: true,
    page: activeTab === "products" ? page : undefined,
    perPage: activeTab === "products" ? perPage : undefined,
  });

  const {
    needs,
    total: totalNeeds,
    isLoading: isLoadingNeeds,
    error: needsError,
  } = useNeeds({
    search: activeTab === "needs" ? debouncedQuery : undefined,
    priority: activeTab === "needs" && priorityFilter !== "all" ? priorityFilter : undefined,
    page: activeTab === "needs" ? page : undefined,
    perPage: activeTab === "needs" ? perPage : undefined,
  });

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { deleteNeed, isDeleting } = useNeed(deleteTargetId || undefined);

  const handleDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    try {
      await deleteNeed();
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, deleteNeed]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setSearchQuery("");
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setPriorityFilter("all");
    setPage(1);
  }, []);

  const isLoading = activeTab === "products" ? isLoadingProducts : isLoadingNeeds;
  const currentTotal = activeTab === "products" ? totalProducts : totalNeeds;
  const totalPages = useMemo(() => Math.ceil(currentTotal / perPage), [currentTotal, perPage]);

  const translatePriority = useCallback(
    (priority: string) => {
      if (priority === "Low") return t("low");
      if (priority === "Medium") return t("medium");
      if (priority === "High") return t("high");
      if (priority === "Urgent") return t("urgent");
      return priority;
    },
    [t]
  );

  return {
    viewMode,
    setViewMode,
    activeTab,
    handleTabChange,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    perPage,
    setPerPage,
    priorityFilter,
    setPriorityFilter,
    products,
    needs,
    isLoading,
    productsError,
    needsError,
    currentTotal,
    totalPages,
    deleteTargetId,
    setDeleteTargetId,
    handleDelete,
    isDeleting,
    clearFilters,
    translatePriority,
    t,
    dir,
    language,
  };
}
