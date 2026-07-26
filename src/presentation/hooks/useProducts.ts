import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/domain/entities/Product";
import { ProductInput } from "@/domain/schemas/product";

export interface UseProductsParams {
  search?: string;
  categoryId?: string;
  brand?: string;
  actionAlert?: boolean;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useProducts(params: UseProductsParams = {}) {
  const queryClient = useQueryClient();

  const getProducts = useQuery<{ products: Product[]; total: number }>({
    queryKey: ["products", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set("search", params.search);
      if (params.categoryId) searchParams.set("categoryId", params.categoryId);
      if (params.brand) searchParams.set("brand", params.brand);
      if (params.actionAlert !== undefined) searchParams.set("actionAlert", params.actionAlert.toString());
      if (params.page !== undefined) searchParams.set("page", params.page.toString());
      if (params.perPage !== undefined) searchParams.set("perPage", params.perPage.toString());
      if (params.sortBy) searchParams.set("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

      const res = await fetch(`/api/products?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const createProduct = useMutation<Product, Error, ProductInput>({
    mutationFn: async (data) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const toggleActionAlert = useMutation<Product, Error, { id: string; actionAlert?: boolean }>({
    mutationFn: async ({ id, actionAlert }) => {
      const res = await fetch(`/api/products/${id}/alert`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionAlert }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update action alert");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", data.id] });
    },
  });

  return {
    products: getProducts.data?.products || [],
    total: getProducts.data?.total || 0,
    isLoading: getProducts.isLoading,
    error: getProducts.error,
    refetch: getProducts.refetch,
    createProduct: createProduct.mutateAsync,
    isCreating: createProduct.isPending,
    toggleActionAlert: toggleActionAlert.mutateAsync,
    isTogglingAlert: toggleActionAlert.isPending,
    togglingAlertId: toggleActionAlert.variables?.id,
  };
}

export function useProduct(id?: string) {
  const queryClient = useQueryClient();

  const getProduct = useQuery<Product>({
    queryKey: ["products", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
    enabled: !!id,
  });

  const updateProduct = useMutation<Product, Error, ProductInput>({
    mutationFn: async (data) => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });

  const deleteProduct = useMutation<Product, Error, void>({
    mutationFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const toggleActionAlert = useMutation<Product, Error, boolean | undefined>({
    mutationFn: async (actionAlert) => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/products/${id}/alert`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionAlert }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update action alert");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });

  return {
    product: getProduct.data,
    isLoading: getProduct.isLoading,
    error: getProduct.error,
    updateProduct: updateProduct.mutateAsync,
    isUpdating: updateProduct.isPending,
    deleteProduct: deleteProduct.mutateAsync,
    isDeleting: deleteProduct.isPending,
    toggleActionAlert: toggleActionAlert.mutateAsync,
    isTogglingAlert: toggleActionAlert.isPending,
  };
}
