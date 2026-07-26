import React, { useState, useEffect } from "react";
import { Plus, Eye, Edit2, Trash2, Search, Loader2, Phone, MapPin, Building, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCompanies, useCompany } from "@/presentation/hooks/useCompanies";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CompanyForm } from "@/presentation/components/CompanyForm";
import { CompanyDetailScreen } from "./CompanyDetailScreen";
import { CompanyInput } from "@/domain/schemas/company";

export function CompanyListScreen() {
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

  const handleOpenAddForm = () => {
    setEditTargetId(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (id: string) => {
    setEditTargetId(id);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: CompanyInput) => {
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
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteCompany();
      setDeleteTargetId(null);
      refetch();
    } catch (e: unknown) {
      console.error(e);
    }
  };

  const totalPages = Math.ceil(total / perPage);

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
      <div className="flex flex-col items-center justify-center p-6 text-center min-h-[300px]">
        <div className="bg-red-500/10 text-red-500 p-3 rounded-full mb-3">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">
          Error Loading Company Data
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
          {error.message || "Failed to load companies"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-955 dark:text-zinc-50">
            Company Management
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your corporate clients, contact info, and track their invoices.
          </p>
        </div>

        <Button
          onClick={handleOpenAddForm}
          className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-1.5 px-4 h-9 rounded-lg font-semibold text-xs transition-all duration-200 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 backdrop-blur-md max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
          <Input
            placeholder="Search companies by name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8.5 h-9 bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 rounded-lg text-xs"
          />
        </div>
      </div>

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
          <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 py-12 px-6 text-center rounded-xl">
            <CardContent className="space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">
                <Building className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                  No Companies Found
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Try adjusting your search criteria or create a new company profile.
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
              <motion.div
                key={company.id}
                whileHover={{ scale: 1.002, y: -1 }}
                className="flex rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xs overflow-hidden gap-4 transition-all duration-300"
              >
                <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                  {company.image ? (
                    <Image
                      src={company.image}
                      alt={company.name}
                      className="object-cover"
                      fill
                      sizes="80px"
                    />
                  ) : (
                    <Building className="h-8 w-8 text-zinc-400" />
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-zinc-950 dark:text-zinc-50 text-sm truncate leading-snug">
                      {company.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-[10px]">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span>{company.phone}</span>
                    </div>
                    {company.address && (
                      <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[9px] truncate">
                        <MapPin className="h-2.5 w-2.5 shrink-0" />
                        <span className="truncate">{company.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-1.5 text-[10px]">
                      <span className="text-zinc-500 font-medium">Total Bills:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        ${(company.bills || []).reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedCompanyId(company.id);
                                setIsDetailView(true);
                              }}
                              className="h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg p-1.5 text-[9px]">
                          <p>View Invoices & Info</p>
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
                              onClick={() => handleOpenEditForm(company.id)}
                              className="h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg p-1.5 text-[9px]">
                          <p>Edit Info</p>
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
                              onClick={() => setDeleteTargetId(company.id)}
                              className="h-8 w-8 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg p-1.5 text-[9px]">
                          <p>Delete Company</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {total > perPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/20 dark:bg-zinc-900/5 mt-6 rounded-xl">
          <div className="text-zinc-400 dark:text-zinc-500">
            Total {total} companies
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
              }
              return buttons;
            })()}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || total === 0}
              className="h-8 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 rounded-lg text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-zinc-50 text-sm font-bold">
              {editTargetId ? "Edit Company" : "Add Company"}
            </DialogTitle>
          </DialogHeader>
          {isFormOpen && (
            <CompanyForm
              initialValues={editTargetId ? editCompanyData || {} : {}}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditTargetId(null);
              }}
              isSubmitting={editTargetId ? isUpdating : isCreating}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-900 dark:text-zinc-50 text-sm">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
              This action cannot be undone. Deleting this company profile will remove it from the system. Associated bills will remain but will not be linked to a company profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-955 dark:text-zinc-50 rounded-lg h-9 text-xs">
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
