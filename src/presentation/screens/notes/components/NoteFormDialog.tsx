"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NoteInput } from "@/domain/schemas/note";

interface NoteFormDialogProps {
  isFormOpen: boolean;
  closeForm: () => void;
  editNoteId: string | null;
  register: UseFormRegister<NoteInput>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<NoteInput>;
  isSaving: boolean;
  getValidationError: (msg?: string) => any;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function NoteFormDialog({
  isFormOpen,
  closeForm,
  editNoteId,
  register,
  handleSubmit,
  errors,
  isSaving,
  getValidationError,
  dir,
  t,
}: NoteFormDialogProps) {
  return (
    <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
      <DialogContent
        className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 max-w-lg"
        dir={dir}
      >
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50 text-xl font-bold text-start">
            {editNoteId ? t("edit_note") : t("add_note")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-zinc-900 dark:text-zinc-300 font-semibold text-start block"
            >
              {t("note_title")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder={t("note_title")}
              {...register("title")}
              className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 text-start"
            />
            {errors.title && (
              <p className="text-xs font-medium text-red-655 dark:text-red-400 text-start">
                {getValidationError(errors.title.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-zinc-900 dark:text-zinc-300 font-semibold text-start block"
            >
              {t("note_content")} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder={t("note_content")}
              rows={5}
              {...register("description")}
              className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-955 dark:focus-visible:ring-zinc-300 resize-none text-start"
            />
            {errors.description && (
              <p className="text-xs font-medium text-red-655 dark:text-red-400 text-start">
                {getValidationError(errors.description.message)}
              </p>
            )}
          </div>

          <div
            className={`pt-4 border-t border-zinc-100 dark:border-zinc-900 flex ${
              dir === "rtl" ? "justify-start" : "justify-end"
            } gap-3`}
          >
            <Button
              type="button"
              variant="outline"
              onClick={closeForm}
              disabled={isSaving}
              className="border-zinc-200 dark:border-zinc-800 text-zinc-955 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-955 hover:bg-zinc-800 dark:hover:bg-zinc-200 min-w-[100px] cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2 shrink-0" />
                  {t("saving", { defaultValue: "Saving..." })}
                </>
              ) : (
                t("save")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
