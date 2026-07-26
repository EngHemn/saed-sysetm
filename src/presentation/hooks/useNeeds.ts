import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Need } from "@/domain/entities/Need";
import { NeedInput } from "@/domain/schemas/need";

export interface UseNeedsParams {
  search?: string;
  priority?: string;
  page?: number;
  perPage?: number;
}

export function useNeeds(params: UseNeedsParams = {}) {
  const queryClient = useQueryClient();

  const getNeeds = useQuery<{ needs: Need[]; total: number }>({
    queryKey: ["needs", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set("search", params.search);
      if (params.priority) searchParams.set("priority", params.priority);
      if (params.page !== undefined) searchParams.set("page", params.page.toString());
      if (params.perPage !== undefined) searchParams.set("perPage", params.perPage.toString());

      const res = await fetch(`/api/needs?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch needs");
      return res.json();
    },
  });

  const createNeed = useMutation<Need, Error, NeedInput>({
    mutationFn: async (data) => {
      const res = await fetch("/api/needs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create need");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["needs"] });
    },
  });

  return {
    needs: getNeeds.data?.needs || [],
    total: getNeeds.data?.total || 0,
    isLoading: getNeeds.isLoading,
    error: getNeeds.error,
    createNeed: createNeed.mutateAsync,
    isCreating: createNeed.isPending,
  };
}

export function useNeed(id?: string) {
  const queryClient = useQueryClient();

  const getNeed = useQuery<Need>({
    queryKey: ["needs", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/needs/${id}`);
      if (!res.ok) throw new Error("Failed to fetch need");
      return res.json();
    },
    enabled: !!id,
  });

  const updateNeed = useMutation<Need, Error, NeedInput>({
    mutationFn: async (data) => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/needs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update need");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["needs"] });
      queryClient.invalidateQueries({ queryKey: ["needs", id] });
    },
  });

  const deleteNeed = useMutation<Need, Error, void>({
    mutationFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/needs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete need");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["needs"] });
    },
  });

  return {
    need: getNeed.data,
    isLoading: getNeed.isLoading,
    error: getNeed.error,
    updateNeed: updateNeed.mutateAsync,
    isUpdating: updateNeed.isPending,
    deleteNeed: deleteNeed.mutateAsync,
    isDeleting: deleteNeed.isPending,
  };
}
