import { useState, useEffect, useCallback } from "react";
import { useNotes, useNote } from "@/presentation/hooks/useNotes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema, NoteInput } from "@/domain/schemas/note";
import { Note } from "@/domain/entities/Note";
import { useLanguage } from "@/presentation/components/language-provider";

export function useNotesViewModel() {
  const { t, dir } = useLanguage();
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

  const form = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { register, handleSubmit, reset, formState } = form;

  const handleEditClick = useCallback(
    (note: Note) => {
      setEditNoteId(note.id);
      reset({
        title: note.title,
        description: note.description,
      });
      setIsFormOpen(true);
    },
    [reset]
  );

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditNoteId(null);
    reset({ title: "", description: "" });
  }, [reset]);

  const openAddForm = useCallback(() => {
    setEditNoteId(null);
    reset({ title: "", description: "" });
    setIsFormOpen(true);
  }, [reset]);

  const handleFormSubmit = useCallback(
    async (data: NoteInput) => {
      try {
        if (editNoteId) {
          await updateNote(data);
        } else {
          await createNote(data);
        }
        closeForm();
      } catch (e: unknown) {
        console.error(e);
      }
    },
    [editNoteId, updateNote, createNote, closeForm]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    try {
      await deleteNote();
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, deleteNote]);

  const getValidationError = (message: string | undefined) => {
    if (!message) return undefined;
    if (message === "Title is required") return t("title_required", { defaultValue: "Title is required" });
    if (message === "Title is too long") return t("title_too_long", { defaultValue: "Title is too long" });
    if (message === "Description is required")
      return t("description_required", { defaultValue: "Description is required" });
    return t(message);
  };

  const isSaving = isCreating || isUpdating;

  return {
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
    setIsFormOpen,
    editNoteId,
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    errors: formState.errors,
    isSaving,
    handleEditClick,
    closeForm,
    openAddForm,
    handleDelete,
    getValidationError,
    t,
    dir,
  };
}
