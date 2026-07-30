import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBill } from "@/presentation/hooks/useBills";
import { BillItem } from "@/domain/entities/Bill";
import { useLanguage } from "@/presentation/components/language-provider";

export function useBillDetailsViewModel(id: string) {
  const router = useRouter();
  const { t, dir, language } = useLanguage();
  const { bill, isLoading, error, deleteBill, isDeleting } = useBill(id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dialogItem, setDialogItem] = useState<BillItem | null>(null);

  const handleDelete = useCallback(async () => {
    try {
      await deleteBill();
      router.push("/dashboard/bills?tab=bill-management");
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setShowDeleteDialog(false);
    }
  }, [deleteBill, router]);

  return {
    bill,
    isLoading,
    error,
    isDeleting,
    showDeleteDialog,
    setShowDeleteDialog,
    dialogItem,
    setDialogItem,
    handleDelete,
    t,
    dir,
    language,
  };
}
