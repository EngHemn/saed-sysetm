"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useNeedsViewModel } from "@/presentation/viewmodels/useNeedsViewModel";
import { NeedListHeader } from "./components/NeedListHeader";
import { NeedListFilters } from "./components/NeedListFilters";
import { NeedListAlertedProducts } from "./components/NeedListAlertedProducts";
import { NeedListStoredNeeds } from "./components/NeedListStoredNeeds";
import { NeedListPagination, NeedDeleteDialog } from "./components/NeedListPagination";

export function NeedListScreen() {
  const {
    viewMode,
    setViewMode,
    activeTab,
    handleTabChange,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    perPage,
    setPerPage,
    priorityFilter,
    setPriorityFilter,
    products,
    needs,
    isLoading,
    productsError,
    needsError,
    currentTotal,
    totalPages,
    deleteTargetId,
    setDeleteTargetId,
    handleDelete,
    isDeleting,
    clearFilters,
    translatePriority,
    t,
    dir,
    language,
  } = useNeedsViewModel();

  if (productsError || needsError) {
    const errorMsg =
      productsError?.message || needsError?.message || "Something went wrong";
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center min-h-[300px]" dir={dir}>
        <div className="bg-red-500/10 text-red-500 p-3 rounded-full mb-3 shrink-0">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">
          {t("error_loading_needs", { defaultValue: "Error Loading Need Management Data" })}
        </h3>
        <p className="text-xs text-zinc-555 dark:text-zinc-400 max-w-sm">
          {errorMsg}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 text-xs" dir={dir}>
      <NeedListHeader activeTab={activeTab} t={t} />

      <NeedListFilters
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        setPage={setPage}
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
            className="space-y-3"
          >
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </motion.div>
        ) : activeTab === "products" ? (
          <motion.div
            key="products-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <NeedListAlertedProducts
              products={products}
              viewMode={viewMode}
              searchQuery={searchQuery}
              clearFilters={clearFilters}
              language={language}
              t={t}
            />
          </motion.div>
        ) : (
          <motion.div
            key="needs-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <NeedListStoredNeeds
              needs={needs}
              searchQuery={searchQuery}
              priorityFilter={priorityFilter}
              clearFilters={clearFilters}
              setDeleteTargetId={setDeleteTargetId}
              translatePriority={translatePriority}
              dir={dir}
              t={t}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {currentTotal > perPage && (
        <NeedListPagination
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          currentTotal={currentTotal}
          totalPages={totalPages}
          t={t}
        />
      )}

      <NeedDeleteDialog
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
