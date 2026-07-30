"use client";

import React from "react";
import { Building, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyDetailScreen } from "./CompanyDetailScreen";
import { useCompaniesViewModel } from "@/presentation/viewmodels/useCompaniesViewModel";
import { CompanyListHeader } from "./components/CompanyListHeader";
import { CompanyListFilters } from "./components/CompanyListFilters";
import { CompanyCard } from "./components/CompanyCard";
import { CompanyListPagination } from "./components/CompanyListPagination";
import { CompanyFormDialog } from "./components/CompanyFormDialog";
import { CompanyDeleteDialog } from "./components/CompanyDeleteDialog";

export function CompanyListScreen() {
  const {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    perPage,
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
    isLoading,
    error,
    refetch,
    editCompanyData,
    isSubmitting,
    isDeleting,
    handleOpenAddForm,
    handleOpenEditForm,
    handleFormSubmit,
    handleDelete,
    totalPages,
    t,
    dir,
  } = useCompaniesViewModel();

  if (isDetailView && selectedCompanyId) {
    return (
      <CompanyDetailScreen
        id={selectedCompanyId}
        onBack={() => {
          setIsDetailView(false);
          setSelectedCompanyId(null);
          refetch();
        }}
      />
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center min-h-[300px]" dir={dir}>
        <div className="bg-red-500/10 text-red-500 p-3 rounded-full mb-3">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1 text-center">
          {t("error_loading_companies")}
        </h3>
        <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-sm text-center">
          {error.message || t("connection_error")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 text-xs" dir={dir}>
      <CompanyListHeader onAddClick={handleOpenAddForm} t={t} />

      <CompanyListFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dir={dir}
        t={t}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </motion.div>
        ) : companies.length === 0 ? (
          <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-955/40 py-12 px-6 text-center rounded-xl">
            <CardContent className="space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">
                <Building className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                  {t("no_results")}
                </h3>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto">
                  {t("no_companies_found")}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            key="companies-grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onView={(id) => {
                  setSelectedCompanyId(id);
                  setIsDetailView(true);
                }}
                onEdit={handleOpenEditForm}
                onDelete={setDeleteTargetId}
                t={t}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {total > perPage && (
        <CompanyListPagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          total={total}
          t={t}
        />
      )}

      <CompanyFormDialog
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        editTargetId={editTargetId}
        setEditTargetId={setEditTargetId}
        editCompanyData={editCompanyData}
        handleFormSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        dir={dir}
        t={t}
      />

      <CompanyDeleteDialog
        deleteTargetId={deleteTargetId}
        setDeleteTargetId={setDeleteTargetId}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
        dir={dir}
        t={t}
      />
    </div>
  );
}
