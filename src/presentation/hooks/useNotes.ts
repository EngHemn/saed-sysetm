import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "@/domain/entities/Note";
import { NoteInput } from "@/domain/schemas/note";

export function useNotes(search?: string) {
  const queryClient = useQueryClient();

  const getNotes = useQuery<Note[]>({
    queryKey: ["notes", search],
    queryFn: async () => {
      const url = search
        ? `/api/notes?search=${encodeURIComponent(search)}`
        : "/api/notes";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch notes");
      return res.json();
    },
  });

  const createNote = useMutation<Note, Error, NoteInput>({
    mutationFn: async (data) => {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create note");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return {
    notes: getNotes.data || [],
    isLoading: getNotes.isLoading,
    error: getNotes.error,
    createNote: createNote.mutateAsync,
    isCreating: createNote.isPending,
  };
}

export function useNote(id?: string) {
  const queryClient = useQueryClient();

  const getNote = useQuery<Note>({
    queryKey: ["notes", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/notes/${id}`);
      if (!res.ok) throw new Error("Failed to fetch note");
      return res.json();
    },
    enabled: !!id,
  });

  const updateNote = useMutation<Note, Error, NoteInput>({
    mutationFn: async (data) => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update note");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
    },
  });

  const deleteNote = useMutation<Note, Error, void>({
    mutationFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete note");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return {
    note: getNote.data,
    isLoading: getNote.isLoading,
    error: getNote.error,
    updateNote: updateNote.mutateAsync,
    isUpdating: updateNote.isPending,
    deleteNote: deleteNote.mutateAsync,
    isDeleting: deleteNote.isPending,
  };
}
