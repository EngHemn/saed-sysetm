"use client";

import React from "react";
import { Package, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProductsViewModel } from "@/presentation/viewmodels/useProductsViewModel";
import { ProductListHeader } from "./components/ProductListHeader";
import { ProductListFilters } from "./components/ProductListFilters";
import { ProductListTable } from "./components/ProductListTable";
import { ProductListGrid } from "./components/ProductListGrid";
import { ProductListPagination } from "./components/ProductListPagination";
import { ProductDeleteDialog } from "./components/ProductDeleteDialog";

export function ProductListScreen() {
  const {
    t,
    dir,
    language,
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
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedBrandFilter,
    setSelectedBrandFilter,
    selectedAlertFilter,
    setSelectedAlertFilter,
    products,
    total,
    categories,
    brandOptions,
    isLoading,
    error,
    handleToggleAlert,
    isTogglingAlert,
    togglingAlertId,
    deleteTargetId,
    setDeleteTargetId,
    handleDelete,
    isDeleting,
    clearFilters,
  } = useProductsViewModel();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="bg-red-50 dark:bg-red-950/20 text-red-655 dark:text-red-400 p-4 rounded-full mb-4">
          <Trash2 className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          {t("error_loading_products")}
        </h3>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm">
          {error.message || t("connection_error")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={dir}>
      <ProductListHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        t={t}
      />

      <ProductListFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategoryFilter={selectedCategoryFilter}
        setSelectedCategoryFilter={setSelectedCategoryFilter}
        selectedBrandFilter={selectedBrandFilter}
        setSelectedBrandFilter={setSelectedBrandFilter}
        selectedAlertFilter={selectedAlertFilter}
        setSelectedAlertFilter={setSelectedAlertFilter}
        categories={categories}
        brandOptions={brandOptions}
        dir={dir}
        t={t}
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ) : products.length === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 px-8 text-center">
          <CardContent className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <Package className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {t("no_results")}
              </h3>
              <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto">
                {t("no_products_found")}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4 border-zinc-250 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50"
            >
              {t("clear_filters")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>
          {/* Mobile View: Always display cards */}
          <div className="block md:hidden">
            <ProductListGrid
              products={products}
              isTogglingAlert={isTogglingAlert}
              togglingAlertId={togglingAlertId}
              handleToggleAlert={handleToggleAlert}
              setDeleteTargetId={setDeleteTargetId}
              language={language}
              t={t}
            />
          </div>

          {/* Desktop View: Respect viewMode selection */}
          <div className="hidden md:block">
            {viewMode === "list" ? (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
                <ProductListTable
                  products={products}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  handleSort={handleSort}
                  isTogglingAlert={isTogglingAlert}
                  togglingAlertId={togglingAlertId}
                  handleToggleAlert={handleToggleAlert}
                  setDeleteTargetId={setDeleteTargetId}
                  dir={dir}
                  language={language}
                  t={t}
                />
              </div>
            ) : (
              <ProductListGrid
                products={products}
                isTogglingAlert={isTogglingAlert}
                togglingAlertId={togglingAlertId}
                handleToggleAlert={handleToggleAlert}
                setDeleteTargetId={setDeleteTargetId}
                language={language}
                t={t}
              />
            )}
          </div>

          <ProductListPagination
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

      <ProductDeleteDialog
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
