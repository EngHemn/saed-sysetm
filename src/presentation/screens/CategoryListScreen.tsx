"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Eye, Edit2, Trash2, FolderOpen, Search, Loader2 } from "lucide-react";
import { useCategories, useCategory } from "@/presentation/hooks/useCategories";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function CategoryCard({
  category,
  onDeleteInitiated,
}: {
  category: any;
  onDeleteInitiated: (id: string) => void;
}) {
  return (
    <Card className="group overflow-hidden pt-0 border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 hover:shadow-lg hover:-translate-y-1 hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col h-[350px] gap-0">
      <div className="relative h-44 flex-1 w-full bg-zinc-50 dark:bg-zinc-900/30 overflow-hidden flex items-center  justify-center border-b border-zinc-100 dark:border-zinc-900/60">
        {category.image ? (
          <>
            <Image
              src={category.image}
              alt={category.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              width={600}
              height={400}
            />
          </>
        ) : (
          <div className="flex flex-col items-center ">
            <FolderOpen className="h-10 w-10 text-zinc-300 dark:text-zinc-700 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-450 dark:text-zinc-650">
              No Image
            </span>
          </div>
        )}
      </div>

      <CardHeader className=" py-0 my-0 ">
        <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 transition-colors">
          {category.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 my-0  py-3   flex flex-col  ">
        <p className="text-sm text-zinc-550 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {category.description || "No description provided for this category."}
        </p>

        {Array.isArray(category.brand) && category.brand.length > 0 && (
          <div className="flex bg flex-wrap gap-1 ">
            {category.brand.slice(0, 2).map((b: string, i: number) => (
              <span
                key={i}
                className="text-[10px] font-medium bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/50"
              >
                {b}
              </span>
            ))}
            {category.brand.length > 2 && (
              <Popover>
                <PopoverTrigger className="text-[10px] font-medium bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-450 px-2 py-0.5 rounded-full transition-colors cursor-pointer outline-none">
                  +{category.brand.length - 2} more
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-md z-50">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-1">
                      Brands
                    </h4>
                    <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
                      {category.brand.map((b: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/50"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-0 px-4 border-t border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/20 flex justify-end gap-1 shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href={`/dashboard/categories/${category.id}?tab=category-management`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
                  )}
                >
                  <Eye className="h-4 w-4" />
                </Link>
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
                <Link
                  href={`/dashboard/categories/${category.id}/edit?tab=category-management`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
                  )}
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
              }
            />
            <TooltipContent>
              <p>Edit Category</p>
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
                  onClick={() => onDeleteInitiated(category.id)}
                  className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>
              <p>Delete Category</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}

function CategoryListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card
          key={i}
          className="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-[340px] flex flex-col"
        >
          <div className="h-44 w-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
          <CardHeader className="p-4 pb-2">
            <Skeleton className="h-5 w-1/2" />
          </CardHeader>
          <CardContent className="px-4 pb-2 pt-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter className="p-4 pt-2 border-t border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/20 flex justify-end gap-2 shrink-0">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function CategoryListScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const { categories, isLoading, error } = useCategories(debouncedQuery);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { deleteCategory, isDeleting } = useCategory(
    deleteTargetId || undefined,
  );

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteCategory();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteTargetId(null);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-4 rounded-full mb-4">
          <Trash2 className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Error Loading Categories
        </h3>
        <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm">
          {error.message ||
            "Something went wrong while retrieving the categories. Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Categories
          </h1>
          <p className="text-sm text-zinc-550 dark:text-zinc-400">
            Manage your store and product categories.
          </p>
        </div>
        <Link
          href="/dashboard/categories/add?tab=category-management"
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-2",
          )}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      <div className="flex items-center gap-4  dark:bg-zinc-950 p-1 rounded-xl">
        <div className="relative flex-1  max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-550" />
          <Input
            placeholder="Search categories or brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-550 dark:text-zinc-450" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading categories...</p>
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
                  No Results Found
                </h3>
                <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto">
                  We couldn't find any category matching "{debouncedQuery}".
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
                <FolderOpen className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  No Categories Found
                </h3>
                <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto">
                  Get started by creating your first product category.
                </p>
              </div>
              <Link
                href="/dashboard/categories/add?tab=category-management"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "mt-4 inline-flex",
                )}
              >
                Create Category
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
              This action cannot be undone. This will permanently delete the
              category and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-950 dark:text-zinc-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-650 dark:hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
