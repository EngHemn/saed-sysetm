"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Loader2, FolderOpen, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCategoryDetailsViewModel } from "@/presentation/viewmodels/useCategoryDetailsViewModel";

interface CategoryDetailScreenProps {
  id: string;
}

export function CategoryDetailScreen({ id }: CategoryDetailScreenProps) {
  const { category, isLoading, error, t, dir } = useCategoryDetailsViewModel(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]" dir={dir}>
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-4 rounded-full mb-4">
          <FolderOpen className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          {t("category_not_found", { defaultValue: "Category Not Found" })}
        </h3>
        <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm">
          {error?.message || t("no_results_desc")}
        </p>
        <Link
          href="/dashboard/categories?tab=category-management"
          className={cn(
            buttonVariants({ variant: "default" }),
            "mt-4 inline-flex",
          )}
        >
          {t("back_to_list")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto" dir={dir}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/categories?tab=category-management"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9 text-zinc-650 dark:text-zinc-400 flex items-center justify-center",
            )}
          >
            <ArrowLeft className={cn("h-5 w-5", dir === "rtl" && "rotate-180")} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t("category_details")}
            </h1>
            <p className="text-sm text-zinc-550 dark:text-zinc-400 text-left">
              {t("detailed_view_desc", { defaultValue: "Detailed view of the product category" })}
            </p>
          </div>
        </div>

        <Link
          href={`/dashboard/categories/${category.id}/edit?tab=category-management`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-2",
          )}
        >
          <Edit2 className="h-4 w-4" />
          {t("edit_category")}
        </Link>
      </div>

      <Card className="border border-zinc-200 pt-0 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
        <div className="relative h-84 pt-0 w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.title}
              className="h-full w-11/12 rounded-lg object-cover"
              width={488}
              height={208}
            />
          ) : (
            <FolderOpen className="h-20 w-20 text-zinc-400 dark:text-zinc-700" />
          )}
        </div>

        <CardHeader className="p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 text-left">
                {category.title}
              </h2>
              {Array.isArray(category.brand) && category.brand.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {category.brand.map((b: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-450 pt-1 text-left">
              <Calendar className="h-3.5 w-3.5" />
              <span>{t("created_on")}: {new Date(category.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 text-left">
              {t("description")}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed text-left">
              {category.description || t("no_description_provided", { defaultValue: "No description provided for this category." })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
