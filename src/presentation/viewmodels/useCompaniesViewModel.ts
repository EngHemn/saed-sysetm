import { useState, useEffect, useCallback, useMemo } from "react";
import { useCompanies, useCompany } from "@/presentation/hooks/useCompanies";
import { CompanyInput } from "@/domain/schemas/company";
import { useLanguage } from "@/presentation/components/language-provider";

export function useCompaniesViewModel() {
  const { t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);

  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const {
    companies,
    total,
    isLoading,
    error,
    refetch,
    createCompany,
    isCreating,
  } = useCompanies({
    search: debouncedQuery,
    page,
    perPage,
  });

  const {
    company: editCompanyData,
    updateCompany,
    isUpdating,
    deleteCompany,
    isDeleting,
  } = useCompany(editTargetId || deleteTargetId || undefined);

  const handleOpenAddForm = useCallback(() => {
    setEditTargetId(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEditForm = useCallback((id: string) => {
    setEditTargetId(id);
    setIsFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: CompanyInput) => {
      try {
        if (editTargetId) {
          await updateCompany(data);
        } else {
          await createCompany(data);
        }
        setIsFormOpen(false);
        setEditTargetId(null);
        refetch();
      } catch (e: unknown) {
        console.error(e);
      }
    },
    [editTargetId, updateCompany, createCompany, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    try {
      await deleteCompany();
      setDeleteTargetId(null);
      refetch();
    } catch (e: unknown) {
      console.error(e);
    }
  }, [deleteTargetId, deleteCompany, refetch]);

  const totalPages = useMemo(() => Math.ceil(total / perPage), [total, perPage]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    perPage,
    setPerPage,
    selectedCompanyId,
    setSelectedCompanyId,
    isDetailView,
    setIsDetailView,
    editTargetId,
    setEditTargetId,
    deleteTargetId,
    setDeleteTargetId,
    isFormOpen,
    setIsFormOpen,
    companies,
    total,
    totalPages,
    isLoading,
    error,
    refetch,
    editCompanyData,
    isCreating,
    isUpdating,
    isSubmitting: isCreating || isUpdating,
    isDeleting,
    handleOpenAddForm,
    handleOpenEditForm,
    handleFormSubmit,
    handleDelete,
    t,
    dir,
  };
}
