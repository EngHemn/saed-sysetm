"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CategoryDeleteDialogProps {
  deleteTargetId: string | null;
  setDeleteTargetId: (id: string | null) => void;
  handleDelete: () => Promise<void>;
  isDeleting: boolean;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function CategoryDeleteDialog({
  deleteTargetId,
  setDeleteTargetId,
  handleDelete,
  isDeleting,
  dir,
  t,
}: CategoryDeleteDialogProps) {
  return (
    <AlertDialog
      open={!!deleteTargetId}
      onOpenChange={(open) => !open && setDeleteTargetId(null)}
    >
      <AlertDialogContent
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
        dir={dir}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-zinc-900 dark:text-zinc-50 text-left">
            {t("confirm_delete_title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-550 dark:text-zinc-400 text-left">
            {t("delete_category_desc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-950 dark:text-zinc-50">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-650 dark:hover:bg-red-700"
          >
            {isDeleting ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
