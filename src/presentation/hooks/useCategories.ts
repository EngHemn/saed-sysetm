import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/domain/entities/Category";
import { CategoryInput } from "@/domain/schemas/category";

export function useCategories(search?: string) {
  const queryClient = useQueryClient();

  const getCategories = useQuery<Category[]>({
    queryKey: ["categories", search],
    queryFn: async () => {
      const url = search
        ? `/api/categories?search=${encodeURIComponent(search)}`
        : "/api/categories";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const createCategory = useMutation<Category, Error, CategoryInput>({
    mutationFn: async (data) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categories: getCategories.data || [],
    isLoading: getCategories.isLoading,
    error: getCategories.error,
    createCategory: createCategory.mutateAsync,
    isCreating: createCategory.isPending,
  };
}

export function useCategory(id?: string) {
  const queryClient = useQueryClient();

  const getCategory = useQuery<Category>({
    queryKey: ["categories", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/categories/${id}`);
      if (!res.ok) throw new Error("Failed to fetch category");
      return res.json();
    },
    enabled: !!id,
  });

  const updateCategory = useMutation<Category, Error, CategoryInput>({
    mutationFn: async (data) => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", id] });
    },
  });

  const deleteCategory = useMutation<Category, Error, void>({
    mutationFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    category: getCategory.data,
    isLoading: getCategory.isLoading,
    error: getCategory.error,
    updateCategory: updateCategory.mutateAsync,
    isUpdating: updateCategory.isPending,
    deleteCategory: deleteCategory.mutateAsync,
    isDeleting: deleteCategory.isPending,
  };
}
