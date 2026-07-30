"use client";

import React from "react";
import { ReceiptText, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBillsViewModel } from "@/presentation/viewmodels/useBillsViewModel";
import { BillListHeader } from "./components/BillListHeader";
import { BillListFilters } from "./components/BillListFilters";
import { BillListTable } from "./components/BillListTable";
import { BillListGrid } from "./components/BillListGrid";
import { BillListPagination } from "./components/BillListPagination";
import { BillPartialPaymentDialog } from "./components/BillPartialPaymentDialog";
import { BillDeleteDialog } from "./components/BillDeleteDialog";

export function BillListScreen() {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    perPage,
    setPerPage,
    sortBy,
    sortOrder,
    handleSort,
    statusFilter,
    setStatusFilter,
    bills,
    total,
    isLoading,
    error,
    refetch,
    updatingStatusId,
    deleteTargetId,
    setDeleteTargetId,
    handleDelete,
    isDeleting,
    handleStatusSelect,
    partialTargetBill,
    setPartialTargetBill,
    partialPaidInput,
    setPartialPaidInput,
    partialError,
    setPartialError,
    confirmPartialPayment,
    clearFilters,
    t,
    dir,
  } = useBillsViewModel();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]" dir={dir}>
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          {t("error_loading_bills", { defaultValue: "Error Loading Bills" })}
        </h3>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm mb-4">
          {error.message || t("connection_error")}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          {t("try_again", { defaultValue: "Try Again" })}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={dir}>
      <BillListHeader
        refetch={refetch}
        viewMode={viewMode}
        setViewMode={setViewMode}
        t={t}
      />

      <BillListFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dir={dir}
        t={t}
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      ) : bills.length === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 px-8 text-center">
          <CardContent className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <ReceiptText className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {t("no_results")}
              </h3>
              <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm mx-auto">
                {t("no_results_desc")}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4 border-zinc-250 dark:border-zinc-800 text-zinc-955 dark:text-zinc-50 hover:bg-zinc-50"
            >
              {t("clear_filters")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "list"
              ? "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs"
              : undefined
          }
        >
          {viewMode === "list" ? (
            <BillListTable
              bills={bills}
              sortBy={sortBy}
              sortOrder={sortOrder}
              handleSort={handleSort}
              updatingStatusId={updatingStatusId}
              handleStatusSelect={handleStatusSelect}
              setDeleteTargetId={setDeleteTargetId}
              dir={dir}
              t={t}
            />
          ) : (
            <BillListGrid
              bills={bills}
              updatingStatusId={updatingStatusId}
              handleStatusSelect={handleStatusSelect}
              setDeleteTargetId={setDeleteTargetId}
              t={t}
            />
          )}

          <BillListPagination
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            total={total}
            viewMode={viewMode}
            t={t}
          />
        </div>
      )}

      <BillDeleteDialog
        deleteTargetId={deleteTargetId}
        setDeleteTargetId={setDeleteTargetId}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
        dir={dir}
        t={t}
      />

      <BillPartialPaymentDialog
        partialTargetBill={partialTargetBill}
        setPartialTargetBill={setPartialTargetBill}
        partialPaidInput={partialPaidInput}
        setPartialPaidInput={setPartialPaidInput}
        partialError={partialError}
        setPartialError={setPartialError}
        confirmPartialPayment={confirmPartialPayment}
        updatingStatusId={updatingStatusId}
        dir={dir}
        t={t}
      />
    </div>
  );
}
