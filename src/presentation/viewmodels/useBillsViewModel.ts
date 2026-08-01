import { useState, useEffect, useCallback } from "react";
import { useBills, useBill } from "@/presentation/hooks/useBills";
import { useLanguage } from "@/presentation/components/language-provider";

export function useBillsViewModel() {
  const { t, dir, formatCurrency } = useLanguage();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<"all" | "Paid" | "Partially Paid" | "Unpaid">("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, statusFilter]);

  const { bills, total, isLoading, error, refetch, updateStatus } = useBills({
    search: debouncedQuery,
    paymentStatus: statusFilter !== "all" ? statusFilter : undefined,
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const { deleteBill, isDeleting } = useBill(deleteTargetId || undefined);

  const [partialTargetBill, setPartialTargetBill] = useState<{
    id: string;
    customerName: string;
    totalAmount: number;
    currentPaid: number;
  } | null>(null);
  const [partialPaidInput, setPartialPaidInput] = useState<string>("");
  const [partialError, setPartialError] = useState<string | null>(null);

  const handleStatusSelect = useCallback(
    async (
      bill: { id: string; customerName: string; totalAmount: number; paidAmount: number; paymentStatus: string },
      newStatus: "Paid" | "Partially Paid" | "Unpaid"
    ) => {
      if (bill.paymentStatus === "Paid") return;

      if (newStatus === "Partially Paid") {
        const defaultAmount =
          bill.paidAmount > 0 && bill.paidAmount < bill.totalAmount
            ? bill.paidAmount
            : Math.round((bill.totalAmount / 2) * 100) / 100;

        setPartialTargetBill({
          id: bill.id,
          customerName: bill.customerName,
          totalAmount: bill.totalAmount,
          currentPaid: defaultAmount,
        });
        setPartialPaidInput(defaultAmount.toString());
        setPartialError(null);
        return;
      }

      try {
        setUpdatingStatusId(bill.id);
        await updateStatus({ id: bill.id, paymentStatus: newStatus });
      } catch (e: unknown) {
        console.error(e);
      } finally {
        setUpdatingStatusId(null);
      }
    },
    [updateStatus]
  );

  const confirmPartialPayment = useCallback(async () => {
    if (!partialTargetBill) return;
    const amount = parseFloat(partialPaidInput);
    if (isNaN(amount) || amount <= 0) {
      setPartialError(t("paid_amount_min", { defaultValue: `Paid amount must be greater than ${formatCurrency(0)}` }));
      return;
    }
    if (amount >= partialTargetBill.totalAmount) {
      setPartialError(
        t("paid_amount_max", {
          defaultValue: `Paid amount must be less than total bill amount (${formatCurrency(partialTargetBill.totalAmount)})`,
        })
      );
      return;
    }

    try {
      setUpdatingStatusId(partialTargetBill.id);
      await updateStatus({
        id: partialTargetBill.id,
        paymentStatus: "Partially Paid",
        paidAmount: amount,
      });
      setPartialTargetBill(null);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setUpdatingStatusId(null);
    }
  }, [partialTargetBill, partialPaidInput, updateStatus, t]);

  const clearFilters = useCallback(() => {
    setStatusFilter("all");
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
    [sortBy, sortOrder]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    try {
      await deleteBill();
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, deleteBill]);

  return {
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
    statusFilter,
    setStatusFilter,
    bills,
    total,
    isLoading,
    error,
    refetch,
    updatingStatusId,
    deleteTargetId,
    setDeleteTargetId,
    handleDelete,
    isDeleting,
    handleStatusSelect,
    partialTargetBill,
    setPartialTargetBill,
    partialPaidInput,
    setPartialPaidInput,
    partialError,
    setPartialError,
    confirmPartialPayment,
    clearFilters,
    t,
    dir,
  };
}
