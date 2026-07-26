"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, AlertCircle, Calendar, Building2, Phone, MapPin, FileText, Eye, Package } from "lucide-react";
import { useBill } from "@/presentation/hooks/useBills";
import { BillItem } from "@/domain/entities/Bill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BillDetailScreenProps {
  id: string;
}

export function BillDetailScreen({ id }: BillDetailScreenProps) {
  const router = useRouter();
  const { bill, isLoading, error, deleteBill, isDeleting } = useBill(id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dialogItem, setDialogItem] = useState<BillItem | null>(null);

  const handleDelete = async () => {
    try {
      await deleteBill();
      router.push("/dashboard/bills?tab=bill-management");
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Bill Not Found
        </h3>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm mb-4">
          {error?.message || "The bill you are looking for does not exist or has been removed."}
        </p>
        <Link
          href="/dashboard/bills?tab=bill-management"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back to Bills
        </Link>
      </div>
    );
  }

  const renderStatusBadge = (status: string) => {
    if (status === "Paid") {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
          Paid
        </Badge>
      );
    }
    if (status === "Partially Paid") {
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800">
          Partially Paid
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800">
        Unpaid
      </Badge>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/bills?tab=bill-management"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9 text-zinc-600 dark:text-zinc-400 flex items-center justify-center"
            )}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Bill #{bill.billNumber}
              </h1>
              {renderStatusBadge(bill.paymentStatus)}
            </div>
            <p className="text-sm text-zinc-555 dark:text-zinc-400">
              Detailed view of customer billing statement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/bills/${bill.id}/edit?tab=bill-management`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50 flex items-center gap-2"
            )}
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Link>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            General Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Building2 className="h-4 w-4 text-zinc-400" />
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">Company Name:</span>
              <span>{bill.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Phone className="h-4 w-4 text-zinc-400" />
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">Phone Number:</span>
              <span>{bill.phone}</span>
            </div>
            {bill.address && (
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-4 w-4 text-zinc-400" />
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">Address:</span>
                <span>{bill.address}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Calendar className="h-4 w-4 text-zinc-400" />
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">Bill Date:</span>
              <span>{new Date(bill.billDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">Created At:</span>
              <span>{new Date(bill.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">Updated At:</span>
              <span>{new Date(bill.updatedAt).toLocaleString()}</span>
            </div>
          </div>

          {bill.image && (
            <div className="md:col-span-2 pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200 block text-sm mb-2">
                Receipt / Bill Image:
              </span>
              <div className="relative h-72 w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                <Image
                  src={bill.image}
                  alt={`Bill #${bill.billNumber} receipt`}
                  className="object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            </div>
          )}

          {bill.notes && (
            <div className="md:col-span-2 pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <FileText className="h-4 w-4 text-zinc-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">Notes:</span>
                  <p className="mt-1 whitespace-pre-wrap">{bill.notes}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Products Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-50 dark:bg-zinc-900/30">
                <TableRow className="border-zinc-200 dark:border-zinc-800">
                  <TableHead>#</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                  <TableHead className="text-right w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bill.items.map((item, idx) => (
                  <TableRow key={item.id} className="border-zinc-200 dark:border-zinc-800">
                    <TableCell className="text-xs text-zinc-400">{idx + 1}</TableCell>
                    <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {item.productName}
                    </TableCell>
                    <TableCell className="text-right font-medium text-zinc-700 dark:text-zinc-300">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right text-zinc-600 dark:text-zinc-400">
                      ${item.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-zinc-900 dark:text-zinc-50">
                      ${item.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setDialogItem(item)}
                                className="h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <TooltipContent>
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
        </CardContent>
      </Card>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                ${bill.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Paid Amount
              </span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${bill.paidAmount.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Remaining Amount
              </span>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                ${bill.remainingAmount.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Payment Status
              </span>
              <div className="mt-1">{renderStatusBadge(bill.paymentStatus)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-900 dark:text-zinc-50">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-555 dark:text-zinc-400">
              This action cannot be undone. This will permanently delete Bill #{bill.billNumber} and all its item records.
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

      <Dialog open={!!dialogItem} onOpenChange={(open) => {
        if (!open) {
          setDialogItem(null);
        }
      }}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {dialogItem ? dialogItem.productName : ""}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Product details in bill items
            </DialogDescription>
          </DialogHeader>

          {dialogItem ? (
            <div className="space-y-4 pt-2">
              {dialogItem.product && dialogItem.product.image ? (
                <div className="relative h-48 w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <Image
                    src={dialogItem.product.image}
                    alt={dialogItem.productName}
                    fill
                    className="object-cover"
                    sizes="350px"
                  />
                </div>
              ) : (
                <div className="h-48 w-full rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/10">
                  <Package className="h-8 w-8 text-zinc-400" />
                </div>
              )}

              {dialogItem.product && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="secondary">
                    Category: {dialogItem.product.category?.title || "Uncategorized"}
                  </Badge>
                  {dialogItem.product.brand && (
                    <Badge variant="outline">Brand: {dialogItem.product.brand}</Badge>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 block">Initial Price</span>
                  <span className="font-bold text-emerald-600">${dialogItem.initialPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">Middle Price</span>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">${dialogItem.middlePrice.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">Final Price</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-50">${dialogItem.finalPrice.toFixed(2)}</span>
                </div>
              </div>

              {dialogItem.product && dialogItem.product.description && (
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">Description:</span>
                  <p className="text-zinc-500 dark:text-zinc-400">{dialogItem.product.description}</p>
                </div>
              )}

              {!dialogItem.product && (
                <div className="py-2 text-xs text-zinc-500">
                  Custom line item: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{dialogItem.productName}</span>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
