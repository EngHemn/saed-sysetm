import { useState, useEffect, useCallback } from "react";
import { useCategories, useCategory } from "@/presentation/hooks/useCategories";
import { useLanguage } from "@/presentation/components/language-provider";

export function useCategoriesViewModel() {
  const { t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const { categories, isLoading, error } = useCategories(debouncedQuery);
  const { deleteCategory, isDeleting } = useCategory(deleteTargetId || undefined);

  const handleDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    try {
      await deleteCategory();
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, deleteCategory]);

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    categories,
    isLoading,
    error,
    deleteTargetId,
    setDeleteTargetId,
    handleDelete,
    isDeleting,
    t,
    dir,
  };
}
