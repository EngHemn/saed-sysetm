import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bill } from "@/domain/entities/Bill";
import { BillInput } from "@/domain/schemas/bill";

export interface UseBillsParams {
  search?: string;
  paymentStatus?: "Paid" | "Partially Paid" | "Unpaid" | "all";
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useBills(params: UseBillsParams = {}) {
  const queryClient = useQueryClient();

  const getBills = useQuery<{ bills: Bill[]; total: number }>({
    queryKey: ["bills", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set("search", params.search);
      if (params.paymentStatus) searchParams.set("paymentStatus", params.paymentStatus);
      if (params.page !== undefined) searchParams.set("page", params.page.toString());
      if (params.perPage !== undefined) searchParams.set("perPage", params.perPage.toString());
      if (params.sortBy) searchParams.set("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

      const res = await fetch(`/api/bills?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch bills");
      return res.json();
    },
  });

  const createBill = useMutation<Bill, Error, BillInput>({
    mutationFn: async (data) => {
      const res = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create bill");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });

  const updateStatus = useMutation<Bill, Error, { id: string; paymentStatus: "Paid" | "Partially Paid" | "Unpaid"; paidAmount?: number }>({
    mutationFn: async ({ id, paymentStatus, paidAmount }) => {
      const res = await fetch(`/api/bills/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus, paidAmount }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update bill status");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bills", variables.id] });
    },
  });

  return {
    bills: getBills.data?.bills || [],
    total: getBills.data?.total || 0,
    isLoading: getBills.isLoading,
    error: getBills.error,
    refetch: getBills.refetch,
    createBill: createBill.mutateAsync,
    isCreating: createBill.isPending,
    updateStatus: updateStatus.mutateAsync,
    isUpdatingStatus: updateStatus.isPending,
  };
}

export function useBill(id?: string) {
  const queryClient = useQueryClient();

  const getBill = useQuery<Bill>({
    queryKey: ["bills", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/bills/${id}`);
      if (!res.ok) throw new Error("Failed to fetch bill");
      return res.json();
    },
    enabled: !!id,
  });

  const updateBill = useMutation<Bill, Error, BillInput>({
    mutationFn: async (data) => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/bills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update bill");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bills", id] });
    },
  });

  const deleteBill = useMutation<Bill, Error, void>({
    mutationFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/bills/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete bill");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });

  return {
    bill: getBill.data,
    isLoading: getBill.isLoading,
    error: getBill.error,
    refetch: getBill.refetch,
    updateBill: updateBill.mutateAsync,
    isUpdating: updateBill.isPending,
    deleteBill: deleteBill.mutateAsync,
    isDeleting: deleteBill.isPending,
  };
}
