"use client";

import React from "react";
import { StickyNote, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotesViewModel } from "@/presentation/viewmodels/useNotesViewModel";
import { NoteCard } from "./components/NoteCard";
import { NoteListHeader, NoteListSkeleton } from "./components/NoteListHeader";
import { NoteListFilters } from "./components/NoteListFilters";
import { NoteFormDialog } from "./components/NoteFormDialog";
import { NoteDeleteDialog, NoteViewDialog } from "./components/NoteDeleteDialog";

export function NoteListScreen() {
  const {
    searchQuery,
    setSearchQuery,
    viewNote,
    setViewNote,
    notes,
    isLoading,
    error,
    deleteTargetId,
    setDeleteTargetId,
    isDeleting,
    isFormOpen,
    editNoteId,
    register,
    handleSubmit,
    errors,
    isSaving,
    handleEditClick,
    closeForm,
    openAddForm,
    handleDelete,
    getValidationError,
    t,
    dir,
  } = useNotesViewModel();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]" dir={dir}>
        <div className="bg-red-50 dark:bg-red-955/20 text-red-655 dark:text-red-400 p-4 rounded-full mb-4 shrink-0">
          <StickyNote className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2 text-center">
          {t("error_loading_notes")}
        </h3>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm mx-auto text-center">
          {error.message || "Something went wrong while retrieving notes. Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={dir}>
      <NoteListHeader openAddForm={openAddForm} t={t} />

      <NoteListFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dir={dir}
        t={t}
      />

      {isLoading ? (
        <NoteListSkeleton />
      ) : notes.length === 0 ? (
        searchQuery ? (
          <Card className="border-dashed border-2 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 px-8 text-center rounded-xl">
            <CardContent className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <Search className="h-6 w-6 shrink-0" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 text-center">
                  {t("no_results")}
                </h3>
                <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm mx-auto text-center">
                  {t("no_results_desc")}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-4 border-zinc-250 dark:border-zinc-800 text-zinc-955 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
              >
                {t("clear_filters")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 px-8 text-center rounded-xl">
            <CardContent className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <StickyNote className="h-6 w-6 shrink-0" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 text-center">
                  {t("no_notes_found")}
                </h3>
                <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm mx-auto text-center">
                  {t("no_notes_found_desc", { defaultValue: "Get started by creating your first note." })}
                </p>
              </div>
              <Button
                onClick={openAddForm}
                className="mt-4 inline-flex cursor-pointer"
              >
                {t("add_note")}
              </Button>
            </CardContent>
          </Card>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onView={setViewNote}
              onEdit={handleEditClick}
              onDeleteInitiated={setDeleteTargetId}
            />
          ))}
        </div>
      )}

      <NoteFormDialog
        isFormOpen={isFormOpen}
        closeForm={closeForm}
        editNoteId={editNoteId}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isSaving={isSaving}
        getValidationError={getValidationError}
        dir={dir}
        t={t}
      />

      <NoteDeleteDialog
        deleteTargetId={deleteTargetId}
        setDeleteTargetId={setDeleteTargetId}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
        dir={dir}
        t={t}
      />

      <NoteViewDialog
        viewNote={viewNote}
        setViewNote={setViewNote}
        dir={dir}
        t={t}
      />
    </div>
  );
}
