"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";

interface NeedListPaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  perPage: number;
  setPerPage: (perPage: number) => void;
  currentTotal: number;
  totalPages: number;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function NeedListPagination({
  page,
  setPage,
  perPage,
  setPerPage,
  currentTotal,
  totalPages,
  t,
}: NeedListPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/20 dark:bg-zinc-900/5 mt-6 rounded-xl">
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-550 font-semibold">
          {t("show")}
        </span>
        <Select
          value={perPage.toString()}
          onValueChange={(val) => {
            setPerPage(parseInt(val || "10", 10));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[70px] h-8 bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800 rounded-lg text-xs">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-550 font-semibold">
          {t("items_per_page")} ({t("total")}: {currentTotal})
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-955 dark:text-zinc-50 rounded-lg text-xs cursor-pointer"
        >
          {t("previous")}
        </Button>
        {(() => {
          const buttons = [];
          for (let i = 1; i <= totalPages; i++) {
            if (
              i === 1 ||
              i === totalPages ||
              (i >= page - 1 && i <= page + 1)
            ) {
              buttons.push(
                <Button
                  key={i}
                  variant={page === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(i)}
                  className={cn(
                    "h-8 w-8 p-0 rounded-lg font-bold text-xs cursor-pointer",
                    page === i
                      ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-955 hover:bg-zinc-800"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-955 dark:text-zinc-50"
                  )}
                >
                  {i}
                </Button>
              );
            } else if (i === page - 2 || i === page + 2) {
              buttons.push(
                <span key={`dots-${i}`} className="px-0.5 text-zinc-400">
                  ...
                </span>
              );
            }
          }
          return buttons;
        })()}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || currentTotal === 0}
          className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-955 dark:text-zinc-50 rounded-lg text-xs cursor-pointer"
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
}

interface NeedDeleteDialogProps {
  deleteTargetId: string | null;
  setDeleteTargetId: (id: string | null) => void;
  handleDelete: () => Promise<void>;
  isDeleting: boolean;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function NeedDeleteDialog({
  deleteTargetId,
  setDeleteTargetId,
  handleDelete,
  isDeleting,
  dir,
  t,
}: NeedDeleteDialogProps) {
  return (
    <AlertDialog
      open={!!deleteTargetId}
      onOpenChange={(open) => !open && setDeleteTargetId(null)}
    >
      <AlertDialogContent
        className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl"
        dir={dir}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-zinc-900 dark:text-zinc-50 text-sm text-start">
            {t("confirm_delete_title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-550 dark:text-zinc-400 text-xs text-start">
            {t("delete_need_desc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter
          className={`flex ${
            dir === "rtl" ? "flex-row-reverse justify-start" : "flex-row justify-end"
          } gap-2`}
        >
          <AlertDialogCancel className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-955 dark:text-zinc-50 rounded-lg h-9 text-xs cursor-pointer">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-650 hover:bg-red-700 text-white dark:bg-red-650 dark:hover:bg-red-700 rounded-lg h-9 text-xs cursor-pointer"
          >
            {isDeleting ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
