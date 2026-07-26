"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Loader2, StickyNote, Calendar, Clock, Eye } from "lucide-react";
import { useNotes, useNote } from "@/presentation/hooks/useNotes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema, NoteInput } from "@/domain/schemas/note";
import { Note } from "@/domain/entities/Note";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

function NoteCard({
  note,
  onView,
  onEdit,
  onDeleteInitiated,
}: {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDeleteInitiated: (id: string) => void;
}) {
  return (
    <Card className="group overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[240px]">
      <div>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
            {note.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-zinc-550 dark:text-zinc-400 line-clamp-4 leading-relaxed whitespace-pre-wrap">
            {note.description}
          </p>
        </CardContent>
      </div>
      <CardFooter className="p-3 border-t border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/20 flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-0.5 text-[10px] text-zinc-450 dark:text-zinc-500 font-medium">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
            <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
            <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(note)}
                    className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-655 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                }
              />
              <TooltipContent>
                <p>View Details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(note)}
                    className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-655 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                }
              />
              <TooltipContent>
                <p>Edit Note</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteInitiated(note.id)}
                    className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 dark:text-red-400 hover:text-red-750 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                }
              />
              <TooltipContent>
                <p>Delete Note</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}

function NoteListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card
          key={i}
          className="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-[240px] flex flex-col justify-between"
        >
          <div className="p-4 space-y-3 flex-1">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <CardFooter className="p-3 border-t border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/20 flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function NoteListScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [viewNote, setViewNote] = useState<Note | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { notes, isLoading, error, createNote, isCreating } = useNotes(debouncedQuery);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { deleteNote, isDeleting } = useNote(deleteTargetId || undefined);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const { updateNote, isUpdating } = useNote(editNoteId || undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleEditClick = (note: Note) => {
    setEditNoteId(note.id);
    reset({
      title: note.title,
      description: note.description,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditNoteId(null);
    reset({ title: "", description: "" });
  };

  const handleFormSubmit = async (data: NoteInput) => {
    try {
      if (editNoteId) {
        await updateNote(data);
      } else {
        await createNote(data);
      }
      closeForm();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteNote();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const isSaving = isCreating || isUpdating;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-4 rounded-full mb-4">
          <StickyNote className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Error Loading Notes
        </h3>
        <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm">
          {error.message || "Something went wrong while retrieving notes. Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Notes
          </h1>
          <p className="text-sm text-zinc-550 dark:text-zinc-400">
            Manage your personal and system notes.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditNoteId(null);
            reset({ title: "", description: "" });
            setIsFormOpen(true);
          }}
          className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-200 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      <div className="flex items-center gap-4 dark:bg-zinc-950 p-1 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
          />
        </div>
      </div>

      {isLoading ? (
        <NoteListSkeleton />
      ) : notes.length === 0 ? (
        debouncedQuery ? (
          <Card className="border-dashed border-2 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 px-8 text-center">
            <CardContent className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <Search className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  No Results Found
                </h3>
                <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto">
                  We couldn't find any note matching "{debouncedQuery}".
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-4 border-zinc-250 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 px-8 text-center">
            <CardContent className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <StickyNote className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  No Notes Found
                </h3>
                <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto">
                  Get started by creating your first note.
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditNoteId(null);
                  reset({ title: "", description: "" });
                  setIsFormOpen(true);
                }}
                className="mt-4 inline-flex"
              >
                Create Note
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

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-zinc-50 text-xl font-bold">
              {editNoteId ? "Edit Note" : "Add Note"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-900 dark:text-zinc-300 font-semibold">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter note title..."
                {...register("title")}
                className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
              />
              {errors.title && (
                <p className="text-xs font-medium text-red-600 dark:text-red-405">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-900 dark:text-zinc-300 font-semibold">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Write your note description here..."
                rows={5}
                {...register("description")}
                className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 resize-none animate-none"
              />
              {errors.description && (
                <p className="text-xs font-medium text-red-650 dark:text-red-405">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeForm}
                disabled={isSaving}
                className="border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 min-w-[100px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Note"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-900 dark:text-zinc-50">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-550 dark:text-zinc-400">
              This action cannot be undone. This will permanently delete your note and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-950 dark:text-zinc-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-650 hover:bg-red-700 text-white dark:bg-red-650 dark:hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!viewNote} onOpenChange={(open) => !open && setViewNote(null)}>
        <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-zinc-50 text-xl font-bold line-clamp-2">
              {viewNote?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="text-sm text-zinc-600 dark:text-zinc-350 bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded-lg border border-zinc-100 dark:border-zinc-900 max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {viewNote?.description}
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-zinc-450 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-900 pt-3 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-455" />
                <span>Created: {viewNote ? new Date(viewNote.createdAt).toLocaleString() : ""}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-zinc-455" />
                <span>Updated: {viewNote ? new Date(viewNote.updatedAt).toLocaleString() : ""}</span>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-900/60">
              <Button
                type="button"
                onClick={() => setViewNote(null)}
                className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
