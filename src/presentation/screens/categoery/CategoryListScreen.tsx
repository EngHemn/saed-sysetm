"use client";

import React from "react";
import Link from "next/link";
import { FolderOpen, Search, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCategoriesViewModel } from "@/presentation/viewmodels/useCategoriesViewModel";
import { CategoryListHeader } from "./components/CategoryListHeader";
import { CategoryListFilters } from "./components/CategoryListFilters";
import { CategoryCard } from "./components/CategoryCard";
import { CategoryDeleteDialog } from "./components/CategoryDeleteDialog";

export function CategoryListScreen() {
  const {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    categories,
    isLoading,
    error,
    deleteTargetId,
    setDeleteTargetId,
    handleDelete,
    isDeleting,
    t,
    dir,
  } = useCategoriesViewModel();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]" dir={dir}>
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-4 rounded-full mb-4">
          <Trash2 className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          {t("error_loading_categories")}
        </h3>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm">
          {error.message || t("connection_error")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={dir}>
      <CategoryListHeader t={t} />

      <CategoryListFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dir={dir}
        t={t}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-555 dark:text-zinc-450" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("loading")}</p>
        </div>
      ) : categories.length === 0 ? (
        debouncedQuery ? (
          <Card className="border-dashed border-2 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 px-8 text-center">
            <CardContent className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <Search className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {t("no_results")}
                </h3>
                <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto">
                  {t("no_categories_found")}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-4 border-zinc-250 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                {t("clear_filters")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 px-8 text-center">
            <CardContent className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <FolderOpen className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {t("no_categories_found")}
                </h3>
                <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto">
                  {t("no_categories_desc", { defaultValue: "Get started by creating your first product category." })}
                </p>
              </div>
              <Link
                href="/dashboard/categories/add?tab=category-management"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "mt-4 inline-flex",
                )}
              >
                {t("add_category")}
              </Link>
            </CardContent>
          </Card>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onDeleteInitiated={setDeleteTargetId}
            />
          ))}
        </div>
      )}

      <CategoryDeleteDialog
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
