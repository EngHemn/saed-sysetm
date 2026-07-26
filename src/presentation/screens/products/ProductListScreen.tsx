"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Eye, Edit2, Trash2, Package, Search, Loader2, AlertTriangle } from "lucide-react";
import { useProducts, useProduct } from "@/presentation/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/presentation/hooks/useCategories";
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

export function ProductListScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("all");
  const [selectedAlertFilter, setSelectedAlertFilter] = useState<"all" | "alert" | "no_alert">("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedCategoryFilter, selectedBrandFilter, selectedAlertFilter]);

  const {
    products,
    total,
    isLoading,
    error,
    toggleActionAlert,
    isTogglingAlert,
    togglingAlertId,
  } = useProducts({
    search: debouncedQuery,
    categoryId: selectedCategoryFilter !== "all" ? selectedCategoryFilter : undefined,
    brand: selectedBrandFilter !== "all" ? selectedBrandFilter : undefined,
    actionAlert: selectedAlertFilter === "alert" ? true : selectedAlertFilter === "no_alert" ? false : undefined,
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  const { categories } = useCategories();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { deleteProduct, isDeleting } = useProduct(deleteTargetId || undefined);

  const handleToggleAlert = async (productId: string, currentAlertStatus: boolean) => {
    try {
      await toggleActionAlert({ id: productId, actionAlert: !currentAlertStatus });
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryFilter);
  const brandOptions = selectedCategory
    ? selectedCategory.brand
    : Array.from(new Set(categories.flatMap((c) => c.brand || [])));

  const filteredProducts = products;

  const clearFilters = () => {
    setSelectedCategoryFilter("all");
    setSelectedBrandFilter("all");
    setSelectedAlertFilter("all");
    setSearchQuery("");
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const renderSortHeader = (field: string, label: string, className?: string) => {
    const isSorted = sortBy === field;
    return (
      <TableHead
        className={cn("cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors select-none", className)}
        onClick={() => handleSort(field)}
      >
        <div className={cn("flex items-center gap-1.5", className?.includes("text-right") && "justify-end")}>
          <span>{label}</span>
          <span className="text-xs text-zinc-400">
            {isSorted ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
          </span>
        </div>
      </TableHead>
    );
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteProduct();
    } catch (e: unknown) {
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
          Error Loading Products
        </h3>
        <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm">
          {error.message || "Something went wrong while retrieving the products. Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Products
          </h1>
          <p className="text-sm text-zinc-550 dark:text-zinc-400">
            Manage your store inventory, pricing, and stock levels.
          </p>
        </div>
        <Link
          href="/dashboard/products/add?tab=product-management"
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-2"
          )}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs">
        <div className="relative col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-555" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        <div>
          <Select value={selectedCategoryFilter} onValueChange={(val) => {
            setSelectedCategoryFilter(val || "all");
            setSelectedBrandFilter("all");
          }}>
            <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
              <SelectValue placeholder="All Categories">
                {selectedCategoryFilter === "all" ? "All Categories" : categories.find(c => c.id === selectedCategoryFilter)?.title}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedBrandFilter} onValueChange={(val) => setSelectedBrandFilter(val || "all")}>
            <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
              <SelectValue placeholder="All Brands">
                {selectedBrandFilter === "all" ? "All Brands" : selectedBrandFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <SelectItem value="all">All Brands</SelectItem>
              {brandOptions.map((brand, idx) => (
                <SelectItem key={idx} value={brand || ""}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedAlertFilter} onValueChange={(val) => setSelectedAlertFilter((val as "all" | "alert" | "no_alert") || "all")}>
            <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
              <SelectValue placeholder="All Alerts">
                {selectedAlertFilter === "all" ? "All Alerts" : selectedAlertFilter === "alert" ? "With Action Alert" : "Without Action Alert"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="alert">With Action Alert</SelectItem>
              <SelectItem value="no_alert">Without Action Alert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 px-8 text-center">
          <CardContent className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <Package className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                No Results Found
              </h3>
              <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto">
                No products match the selected filters or search query.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4 border-zinc-250 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableHead className="w-16">Image</TableHead>
                {renderSortHeader("title", "Title")}
                <TableHead>Category & Brand</TableHead>
                {renderSortHeader("middlePrice", "Middle Price", "text-right")}
                {renderSortHeader("finalPrice", "Final Price", "text-right")}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const isToggling = isTogglingAlert && togglingAlertId === product.id;
                return (
                  <TableRow
                    key={product.id}
                    className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors"
                  >
                    <TableCell className="p-3">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.title}
                            className="object-cover"
                            fill
                            sizes="40px"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-zinc-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100 max-w-[200px] truncate">
                      {product.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-zinc-650 dark:text-zinc-300">
                          {product.category?.title || "Uncategorized"}
                        </span>
                        {product.brand && (
                          <span className="text-xs text-zinc-450 dark:text-zinc-500">
                            Brand: {product.brand}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-zinc-600 dark:text-zinc-400">
                      ${product.middlePrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-zinc-900 dark:text-zinc-50">
                      ${product.finalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isToggling}
                                  onClick={() => handleToggleAlert(product.id, product.actionAlert)}
                                  className={cn(
                                    "h-8 w-8 transition-colors",
                                    product.actionAlert
                                      ? "text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
                                      : "text-zinc-400 hover:text-zinc-500 dark:text-zinc-650 dark:hover:text-zinc-500"
                                  )}
                                >
                                  {isToggling ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <AlertTriangle className={cn("h-4 w-4", product.actionAlert && "fill-current")} />
                                  )}
                                </Button>
                              }
                            />
                            <TooltipContent>
                              <p>{product.actionAlert ? "Disable Action Alert" : "Enable Action Alert"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Link
                                  href={`/dashboard/products/${product.id}?tab=product-management`}
                                  className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  )}
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                              }
                            />
                            <TooltipContent>
                              <p>View Product Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Link
                                  href={`/dashboard/products/${product.id}/edit?tab=product-management`}
                                  className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  )}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Link>
                              }
                            />
                            <TooltipContent>
                              <p>Edit Product</p>
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
                                  onClick={() => setDeleteTargetId(product.id)}
                                  className="h-8 w-8 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <TooltipContent>
                              <p>Delete Product</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/5">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-550 dark:text-zinc-400">
                Show
              </span>
              <Select
                value={perPage.toString()}
                onValueChange={(val) => {
                  setPerPage(parseInt(val || "10", 10));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[80px] h-8 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-zinc-550 dark:text-zinc-400">
                items per page (Total: {total})
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50"
              >
                Previous
              </Button>
              {(() => {
                const totalPages = Math.ceil(total / perPage);
                const buttons = [];
                for (let i = 1; i <= totalPages; i++) {
                  if (
                    i === 1 ||
                    i === totalPages ||
                    (i >= page - 1 && i <= page + 1)
                  ) {
                    buttons.push(
                      <Button
                        key={i}
                        variant={page === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(i)}
                        className={cn(
                          "h-8 w-8 p-0",
                          page === i
                            ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950"
                            : "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50"
                        )}
                      >
                        {i}
                      </Button>
                    );
                  } else if (
                    i === page - 2 ||
                    i === page + 2
                  ) {
                    buttons.push(
                      <span key={`dots-${i}`} className="px-1 text-zinc-450">
                        ...
                      </span>
                    );
                  }
                }
                return buttons;
              })()}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(total / perPage)))}
                disabled={page === Math.ceil(total / perPage) || total === 0}
                className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-900 dark:text-zinc-50">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-555 dark:text-zinc-400">
              This action cannot be undone. This will permanently delete the product and remove its data from our servers.
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
