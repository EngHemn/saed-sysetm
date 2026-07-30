"use client";

import React from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Note } from "@/domain/entities/Note";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NoteDeleteDialogProps {
  deleteTargetId: string | null;
  setDeleteTargetId: (id: string | null) => void;
  handleDelete: () => Promise<void>;
  isDeleting: boolean;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function NoteDeleteDialog({
  deleteTargetId,
  setDeleteTargetId,
  handleDelete,
  isDeleting,
  dir,
  t,
}: NoteDeleteDialogProps) {
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
          <AlertDialogTitle className="text-zinc-900 dark:text-zinc-50 text-start">
            {t("confirm_delete_title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-555 dark:text-zinc-400 text-start">
            {t("delete_note_desc")}
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

interface NoteViewDialogProps {
  viewNote: Note | null;
  setViewNote: (note: Note | null) => void;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function NoteViewDialog({
  viewNote,
  setViewNote,
  dir,
  t,
}: NoteViewDialogProps) {
  return (
    <Dialog open={!!viewNote} onOpenChange={(open) => !open && setViewNote(null)}>
      <DialogContent
        className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 max-w-lg"
        dir={dir}
      >
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50 text-xl font-bold line-clamp-2 text-start">
            {viewNote?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="text-sm text-zinc-600 dark:text-zinc-350 bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded-lg border border-zinc-100 dark:border-zinc-900 max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed text-start">
            {viewNote?.description}
          </div>
          <div className="flex flex-col gap-1 text-[11px] text-zinc-450 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-900 pt-3 font-medium text-start">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-zinc-455 shrink-0" />
              <span>
                {t("created", { defaultValue: "Created" })}:{" "}
                {viewNote ? new Date(viewNote.createdAt).toLocaleString() : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-zinc-455 shrink-0" />
              <span>
                {t("updated", { defaultValue: "Updated" })}:{" "}
                {viewNote ? new Date(viewNote.updatedAt).toLocaleString() : ""}
              </span>
            </div>
          </div>
          <div
            className={`flex ${
              dir === "rtl" ? "justify-start" : "justify-end"
            } pt-2 border-t border-zinc-100 dark:border-zinc-900/60`}
          >
            <Button
              type="button"
              onClick={() => setViewNote(null)}
              className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-200 cursor-pointer"
            >
              {t("close", { defaultValue: "Close" })}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
