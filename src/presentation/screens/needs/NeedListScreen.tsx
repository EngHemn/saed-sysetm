"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Eye, Edit2, Trash2, Package, Search, Loader2, ArrowRightLeft, ClipboardList, AlertCircle, ChevronRight, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "@/presentation/hooks/useProducts";
import { useNeeds, useNeed } from "@/presentation/hooks/useNeeds";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { formatDate } from "date-fns";

export function NeedListScreen() {
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, priorityFilter, activeTab]);

  const {
    products,
    total: totalProducts,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts({
    search: activeTab === "products" ? debouncedQuery : undefined,
    actionAlert: true,
    page: activeTab === "products" ? page : undefined,
    perPage: activeTab === "products" ? perPage : undefined,
  });

  const {
    needs,
    total: totalNeeds,
    isLoading: isLoadingNeeds,
    error: needsError,
  } = useNeeds({
    search: activeTab === "needs" ? debouncedQuery : undefined,
    priority: activeTab === "needs" && priorityFilter !== "all" ? priorityFilter : undefined,
    page: activeTab === "needs" ? page : undefined,
    perPage: activeTab === "needs" ? perPage : undefined,
  });

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { deleteNeed, isDeleting } = useNeed(deleteTargetId || undefined);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteNeed();
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery("");
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setPage(1);
  };

  if (productsError || needsError) {
    const errorMsg = productsError?.message || needsError?.message || "Something went wrong";
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center min-h-[300px]">
        <div className="bg-red-500/10 text-red-500 p-3 rounded-full mb-3">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">
          Error Loading Need Management Data
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
          {errorMsg}
        </p>
      </div>
    );
  }

  const isLoading = activeTab === "products" ? isLoadingProducts : isLoadingNeeds;
  const currentTotal = activeTab === "products" ? totalProducts : totalNeeds;
  const totalPages = Math.ceil(currentTotal / perPage);

  return (
    <div className="space-y-6 pb-8 text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-900/5 dark:bg-white/5 text-zinc-655 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50 mb-1.5">
            <ClipboardList className="h-3 w-3 text-zinc-500" />
            <span>Store Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
            Need Management
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Optimize your inventory by managing needed items and processing product action alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "needs" && (
            <Link
              href="/dashboard/needs/add?tab=needs-management"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-955 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-1.5 px-4 py-2 h-9 rounded-lg shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 font-semibold text-xs"
              )}
            >
              <Plus className="h-4 w-4" />
              Add Custom Need
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 rounded-xl bg-zinc-150/40 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 backdrop-blur-md">
        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 w-fit">
          {["products", "needs"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "relative px-4 py-1.5 rounded-md text-[11px] font-bold capitalize transition-all duration-300",
                activeTab === tab
                  ? "bg-white dark:bg-zinc-900 text-zinc-955 dark:text-zinc-50 shadow-xs border border-zinc-200/50 dark:border-zinc-800/50"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              )}
            >
              {tab === "products" ? "Alerted Products" : "Stored Needs"}
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-center gap-2 max-w-sm w-full ml-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
            <Input
              placeholder={activeTab === "products" ? "Search alerted products..." : "Search needs..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 h-9 bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 rounded-lg text-xs"
            />
          </div>

          {activeTab === "needs" && (
            <div className="w-[120px] shrink-0">
              <Select value={priorityFilter} onValueChange={(val) => setPriorityFilter(val || "all")}>
                <SelectTrigger className="h-9 bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Filter className="h-3 w-3" />
                    <SelectValue placeholder="Priority" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

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
            {products.length === 0 ? (
              <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 py-12 px-6 text-center rounded-xl">
                <CardContent className="space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                      No Alerted Products
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                      Currently, there are no products marked with action alerts that need restocked.
                    </p>
                  </div>
                  {searchQuery && (
                    <Button variant="outline" onClick={clearFilters} className="mt-1 border-zinc-200 dark:border-zinc-800 rounded-lg h-8 text-xs">
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
                <Table className="text-xs">
                  <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
                    <TableRow className="border-zinc-200 dark:border-zinc-800 h-10">
                      <TableHead className="w-12">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category & Brand</TableHead>
                      <TableHead className="text-right">Middle Price</TableHead>
                      <TableHead className="text-right">Final Price</TableHead>
                      <TableHead className="text-right w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={product.id}
                        className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors h-12"
                      >
                        <TableCell className="p-1.5 pl-3">
                          <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.title}
                                className="object-cover"
                                fill
                                sizes="32px"
                              />
                            ) : (
                              <Package className="h-4 w-4 text-zinc-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {product.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-zinc-650 dark:text-zinc-300">
                              {product.category?.title || "Uncategorized"}
                            </span>
                            {product.brand && (
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                                {product.brand}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-zinc-600 dark:text-zinc-450 font-medium">
                          ${product.middlePrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-zinc-950 dark:text-zinc-50">
                          ${product.finalPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right pr-3">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger
                                render={
                                  <Link
                                    href={`/dashboard/products/${product.id}?tab=product-management`}
                                    className={cn(
                                      buttonVariants({ variant: "ghost", size: "icon" }),
                                      "h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                                    )}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                }
                              />
                              <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg p-1.5 text-[10px]">
                                <p>View Product Details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
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
            {needs.length === 0 ? (
              <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 py-12 px-6 text-center rounded-xl">
                <CardContent className="space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                      No Needs Recorded
                    </h3>
                    <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto">
                      There are no active need items matching your search or selection filters.
                    </p>
                  </div>
                  {(searchQuery || priorityFilter !== "all") && (
                    <Button variant="outline" onClick={clearFilters} className="mt-1 border-zinc-200 dark:border-zinc-800 rounded-lg h-8 text-xs">
                      Clear Filter Settings
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {needs.map((need) => (
                  <motion.div
                    key={need.id}
                    whileHover={{ scale: 1.002, y: -1 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-950 shadow-xs hover:shadow-xs transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {need.image ? (
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50">
                          <Image
                            src={need.image}
                            alt={need.title}
                            className="object-cover"
                            fill
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-450 dark:text-zinc-500 shrink-0 border border-zinc-200/50 dark:border-zinc-800/50">
                          <ClipboardList className="h-5 w-5" />
                        </div>
                      )}

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={cn(
                              "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase",
                              need.priority === "High" && "bg-red-500/10 text-red-650 dark:bg-red-955/20 dark:text-red-400 border border-red-500/20",
                              need.priority === "Medium" && "bg-amber-500/10 text-amber-650 dark:bg-amber-955/20 dark:text-amber-400 border border-amber-500/20",
                              need.priority === "Low" && "bg-zinc-500/10 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-350 border border-zinc-200 dark:border-zinc-800"
                            )}
                          >
                            {need.priority}
                          </span>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold">
                            {formatDate(new Date(need.createdAt), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <h3 className="font-bold text-zinc-950 dark:text-zinc-50 truncate text-sm leading-snug">
                          {need.title}
                        </h3>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-550 line-clamp-1 max-w-[280px]">
                          {need.description || "No specific details provided."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 sm:self-center shrink-0 self-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Link
                                href={`/dashboard/needs/${need.id}?tab=needs-management`}
                                className={cn(
                                  buttonVariants({ variant: "ghost", size: "icon" }),
                                  "h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                                )}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            }
                          />
                          <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg p-1.5 text-[9px]">
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Link
                                href={`/dashboard/needs/${need.id}/edit?tab=needs-management`}
                                className={cn(
                                  buttonVariants({ variant: "ghost", size: "icon" }),
                                  "h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                                )}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Link>
                            }
                          />
                          <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg p-1.5 text-[9px]">
                            <p>Edit Request</p>
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
                                onClick={() => setDeleteTargetId(need.id)}
                                className="h-8 w-8 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg p-1.5 text-[9px]">
                            <p>Delete Request</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {currentTotal > perPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/20 dark:bg-zinc-900/5 mt-6 rounded-xl">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold">
              Show
            </span>
            <Select
              value={perPage.toString()}
              onValueChange={(val) => {
                setPerPage(parseInt(val || "10", 10));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[70px] h-8 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold">
              items per page (Total: {currentTotal})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 rounded-lg text-xs"
            >
              Previous
            </Button>
            {(() => {
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
                        "h-8 w-8 p-0 rounded-lg font-bold text-xs",
                        page === i
                          ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-955"
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
                    <span key={`dots-${i}`} className="px-0.5 text-zinc-400">
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
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || currentTotal === 0}
              className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 rounded-lg text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-900 dark:text-zinc-50 text-sm">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
              This action cannot be undone. This will permanently delete the need request and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-950 dark:text-zinc-50 rounded-lg h-9 text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-650 hover:bg-red-700 text-white dark:bg-red-650 dark:hover:bg-red-700 rounded-lg h-9 text-xs"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
