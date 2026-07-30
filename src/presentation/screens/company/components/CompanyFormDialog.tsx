"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompanyForm } from "@/presentation/components/CompanyForm";
import { CompanyInput } from "@/domain/schemas/company";

interface CompanyFormDialogProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  editTargetId: string | null;
  setEditTargetId: (id: string | null) => void;
  editCompanyData?: Partial<CompanyInput>;
  handleFormSubmit: (data: CompanyInput) => Promise<void>;
  isSubmitting: boolean;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function CompanyFormDialog({
  isFormOpen,
  setIsFormOpen,
  editTargetId,
  setEditTargetId,
  editCompanyData,
  handleFormSubmit,
  isSubmitting,
  dir,
  t,
}: CompanyFormDialogProps) {
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:max-w-md"
        dir={dir}
      >
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50 text-sm font-bold text-left">
            {editTargetId ? t("edit_company") : t("add_company")}
          </DialogTitle>
        </DialogHeader>
        {isFormOpen && (
          <CompanyForm
            initialValues={editTargetId ? editCompanyData || {} : {}}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditTargetId(null);
            }}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
