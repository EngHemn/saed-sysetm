import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Company } from "@/domain/entities/Company";
import { CompanyInput } from "@/domain/schemas/company";

export interface UseCompaniesParams {
  search?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useCompanies(params: UseCompaniesParams = {}) {
  const queryClient = useQueryClient();

  const getCompanies = useQuery<{ companies: Company[]; total: number }>({
    queryKey: ["companies", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set("search", params.search);
      if (params.page !== undefined) searchParams.set("page", params.page.toString());
      if (params.perPage !== undefined) searchParams.set("perPage", params.perPage.toString());
      if (params.sortBy) searchParams.set("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

      const res = await fetch(`/api/companies?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch companies");
      return res.json();
    },
  });

  const createCompany = useMutation<Company, Error, CompanyInput>({
    mutationFn: async (data) => {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create company");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return {
    companies: getCompanies.data?.companies || [],
    total: getCompanies.data?.total || 0,
    isLoading: getCompanies.isLoading,
    error: getCompanies.error,
    refetch: getCompanies.refetch,
    createCompany: createCompany.mutateAsync,
    isCreating: createCompany.isPending,
  };
}

export function useCompany(id?: string) {
  const queryClient = useQueryClient();

  const getCompany = useQuery<Company & { bills: any[] }>({
    queryKey: ["companies", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/companies/${id}`);
      if (!res.ok) throw new Error("Failed to fetch company");
      return res.json();
    },
    enabled: !!id,
  });

  const updateCompany = useMutation<Company, Error, CompanyInput>({
    mutationFn: async (data) => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update company");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companies", id] });
    },
  });

  const deleteCompany = useMutation<Company, Error, void>({
    mutationFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete company");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return {
    company: getCompany.data,
    isLoading: getCompany.isLoading,
    error: getCompany.error,
    refetch: getCompany.refetch,
    updateCompany: updateCompany.mutateAsync,
    isUpdating: updateCompany.isPending,
    deleteCompany: deleteCompany.mutateAsync,
    isDeleting: deleteCompany.isPending,
  };
}
