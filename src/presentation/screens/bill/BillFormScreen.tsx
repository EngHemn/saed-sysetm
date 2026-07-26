"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  Upload,
  X,
  Eye,
  Search,
  ChevronDown,
  Package,
  Building,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { billSchema, BillInput } from "@/domain/schemas/bill";
import { useBills, useBill } from "@/presentation/hooks/useBills";
import { useProducts } from "@/presentation/hooks/useProducts";
import { useCompanies } from "@/presentation/hooks/useCompanies";
import { CompanyForm } from "@/presentation/components/CompanyForm";
import { ProductForm } from "@/presentation/components/ProductForm";
import { CompanyInput } from "@/domain/schemas/company";
import { ProductInput } from "@/domain/schemas/product";
import { Product } from "@/domain/entities/Product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BillFormScreenProps {
  id?: string;
}

export function BillFormScreen({ id }: BillFormScreenProps) {
  const router = useRouter();
  const isEditMode = !!id;

  const { createBill, isCreating } = useBills();
  const { bill, isLoading: isFetching, updateBill, isUpdating } = useBill(id);
  const { products, refetch: refetchProducts } = useProducts({ perPage: 100 });

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [customProductName, setCustomProductName] = useState("");
  const [productQty, setProductQty] = useState(1);
  const [productUnitPrice, setProductUnitPrice] = useState(0);

  const [searchProductQuery, setSearchProductQuery] = useState("");
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  const [companySearchQuery, setCompanySearchQuery] = useState("");
  const [isCompanyComboboxOpen, setIsCompanyComboboxOpen] = useState(false);
  const companyComboboxRef = useRef<HTMLDivElement>(null);
  const [isAddCompanyDialogOpen, setIsAddCompanyDialogOpen] = useState(false);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);

  const { companies: companyList } = useCompanies({
    search: companySearchQuery,
    perPage: 50,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);
  const [dialogItem, setDialogItem] = useState<{
    productId?: string | null;
    productName: string;
    initialPrice: number;
    middlePrice: number;
    finalPrice: number;
  } | null>(null);

  const dialogProductCatalog = useMemo(() => {
    if (!dialogItem || !dialogItem.productId) return null;
    return products.find((p) => p.id === dialogItem.productId) || null;
  }, [dialogItem, products]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<BillInput>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      image: "",
      billDate: new Date().toISOString().split("T")[0],
      notes: "",
      paidAmount: 0,
      items: [],
      companyId: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items") || [];
  const paidAmount = watch("paidAmount") || 0;
  const imageUrl = watch("image");
  const selectedCompanyName = watch("customerName");
  const selectedCompanyPhone = watch("phone");
  const selectedCompanyAddress = watch("address");
  const selectedCompanyId = watch("companyId");

  const totalAmount = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0), 0);
  }, [items]);

  const remainingAmount = useMemo(() => {
    return Math.max(0, totalAmount - paidAmount);
  }, [totalAmount, paidAmount]);

  const paymentStatus = useMemo(() => {
    if (paidAmount >= totalAmount && totalAmount > 0) return "Paid";
    if (paidAmount > 0 && paidAmount < totalAmount) return "Partially Paid";
    return "Unpaid";
  }, [totalAmount, paidAmount]);

  const filteredProducts = useMemo(() => {
    if (!searchProductQuery.trim()) return products;
    const q = searchProductQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category?.title && p.category.title.toLowerCase().includes(q))
    );
  }, [products, searchProductQuery]);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsComboboxOpen(false);
      }
      if (companyComboboxRef.current && !companyComboboxRef.current.contains(event.target as Node)) {
        setIsCompanyComboboxOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (bill) {
      const formattedDate = bill.billDate
        ? new Date(bill.billDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      reset({
        customerName: bill.customerName,
        phone: bill.phone,
        address: bill.address || "",
        image: bill.image || "",
        billDate: formattedDate,
        notes: bill.notes || "",
        paidAmount: bill.paidAmount,
        items: bill.items.map((item) => ({
          productId: item.productId || null,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          initialPrice: item.initialPrice,
          middlePrice: item.middlePrice,
          finalPrice: item.finalPrice,
        })),
        companyId: bill.companyId || null,
      });
      setCompanySearchQuery(bill.customerName);
    }
  }, [bill, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      if (data.success && data.result?.secure_url) {
        setValue("image", data.result.secure_url, { shouldValidate: true });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during upload";
      setImageError(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setValue("image", "", { shouldValidate: true });
  };

  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setCustomProductName(product.title);
    setProductUnitPrice(product.initPrice);
    setSearchProductQuery(product.title);
    setIsComboboxOpen(false);
  };

  const handleClearSelectedProduct = () => {
    setSelectedProductId("");
    setCustomProductName("");
    setProductUnitPrice(0);
    setSearchProductQuery("");
  };

  const handleAddProductItem = () => {
    const pName = customProductName.trim();
    if (!pName) return;
    if (productQty < 1 || productUnitPrice < 0) return;

    const existingIndex = items.findIndex((item) => {
      if (selectedProductId && item.productId === selectedProductId) return true;
      return item.productName.trim().toLowerCase() === pName.toLowerCase();
    });

    if (existingIndex !== -1) {
      const existingItem = items[existingIndex];
      const newQty = (existingItem.quantity || 0) + productQty;
      setValue(`items.${existingIndex}.quantity`, newQty, { shouldValidate: true });
      setValue(`items.${existingIndex}.unitPrice`, productUnitPrice, { shouldValidate: true });
      setValue(`items.${existingIndex}.initialPrice`, productUnitPrice, { shouldValidate: true });
      setValue(`items.${existingIndex}.totalPrice`, newQty * productUnitPrice, { shouldValidate: true });
      if (selectedProduct) {
        setValue(`items.${existingIndex}.middlePrice`, selectedProduct.middlePrice, { shouldValidate: true });
        setValue(`items.${existingIndex}.finalPrice`, selectedProduct.finalPrice, { shouldValidate: true });
      }
      
      setDuplicateWarning(`"${existingItem.productName}" is already in this bill. Quantity updated to ${newQty}.`);
      setTimeout(() => setDuplicateWarning(null), 4000);
    } else {
      append({
        productId: selectedProductId || null,
        productName: pName,
        quantity: productQty,
        unitPrice: productUnitPrice,
        totalPrice: productQty * productUnitPrice,
        initialPrice: productUnitPrice,
        middlePrice: selectedProduct ? selectedProduct.middlePrice : 0,
        finalPrice: selectedProduct ? selectedProduct.finalPrice : 0,
      });
      setDuplicateWarning(null);
    }

    setSelectedProductId("");
    setCustomProductName("");
    setProductQty(1);
    setProductUnitPrice(0);
    setSearchProductQuery("");
  };

  const handleViewTableItem = (item: {
    productId?: string | null;
    productName: string;
    initialPrice?: number;
    middlePrice?: number;
    finalPrice?: number;
  }) => {
    setDialogItem({
      productId: item.productId,
      productName: item.productName,
      initialPrice: item.initialPrice ?? 0,
      middlePrice: item.middlePrice ?? 0,
      finalPrice: item.finalPrice ?? 0,
    });
  };

  const [isCreatingCompany, setIsCreatingCompany] = useState(false);

  const handleCreateCompanySubmit = async (data: CompanyInput) => {
    setIsCreatingCompany(true);
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to create company");
      }
      const company = await res.json();
      setValue("customerName", company.name);
      setValue("phone", company.phone);
      setValue("address", company.address || "");
      setValue("companyId", company.id);
      setIsAddCompanyDialogOpen(false);
      setCompanySearchQuery(company.name);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsCreatingCompany(false);
    }
  };

  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const handleCreateProductSubmit = async (data: ProductInput) => {
    setIsCreatingProduct(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to create product");
      }
      const product = await res.json();
      await refetchProducts();
      setSelectedProductId(product.id);
      setCustomProductName(product.title);
      setProductUnitPrice(product.initPrice);
      setSearchProductQuery(product.title);
      setIsAddProductDialogOpen(false);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const onSubmit = async (data: BillInput) => {
    if (isEditMode && bill?.paymentStatus === "Paid" && paymentStatus === "Unpaid") {
      setError("paidAmount", {
        type: "manual",
        message: "A paid bill cannot be changed to unpaid",
      });
      return;
    }
    try {
      if (isEditMode && id) {
        await updateBill(data);
      } else {
        await createBill(data);
      }
      setFormSuccessMessage(isEditMode ? "Bill updated successfully!" : "Bill created successfully!");
      setTimeout(() => {
        router.push("/dashboard/bills?tab=bill-management");
      }, 1000);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An error occurred";
      setError("paidAmount", {
        type: "manual",
        message,
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;

  if (isEditMode && isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {isEditMode ? "Edit Bill" : "Add Bill"}
          </h1>
          <p className="text-sm text-zinc-555 dark:text-zinc-400">
            {isEditMode
              ? "Update bill details and uploaded receipt"
              : "Create a new bill, upload receipt, and add items"}
          </p>
        </div>
      </div>

      {formSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium">{formSuccessMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Company Information & Receipt Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-900 dark:text-zinc-300 font-semibold">
                Company Search <span className="text-red-500">*</span>
              </Label>
              {selectedCompanyName ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                      <Building className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-zinc-950 dark:text-zinc-50 text-xs">
                        {selectedCompanyName}
                      </h4>
                      <div className="flex items-center gap-3 text-zinc-550 dark:text-zinc-400 text-[10px]">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-zinc-400" />
                          {selectedCompanyPhone}
                        </span>
                        {selectedCompanyAddress && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-zinc-400" />
                            {selectedCompanyAddress}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setValue("customerName", "");
                      setValue("phone", "");
                      setValue("address", "");
                      setValue("companyId", null);
                      setCompanySearchQuery("");
                    }}
                    className="h-8 text-xs border-zinc-200 dark:border-zinc-800"
                  >
                    Change Company
                  </Button>
                </div>
              ) : (
                <div className="relative" ref={companyComboboxRef}>
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                    <Input
                      placeholder="Type company name or phone to search..."
                      value={companySearchQuery}
                      onChange={(e) => {
                        setCompanySearchQuery(e.target.value);
                        setIsCompanyComboboxOpen(true);
                      }}
                      onFocus={() => setIsCompanyComboboxOpen(true)}
                      className="pl-9 pr-10 bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  </div>

                  {isCompanyComboboxOpen && (
                    <div className="absolute z-50 left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg p-1 space-y-1">
                      {companyList.length === 0 ? (
                        <div className="p-3 text-xs text-center space-y-2">
                          <p className="text-zinc-500">No company found matching your query.</p>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                              setIsCompanyComboboxOpen(false);
                              setIsAddCompanyDialogOpen(true);
                            }}
                            className="w-full text-xs h-8"
                          >
                            Add New Company
                          </Button>
                        </div>
                      ) : (
                        <>
                          {companyList.map((comp) => (
                            <div
                              key={comp.id}
                              onClick={() => {
                                setValue("customerName", comp.name);
                                setValue("phone", comp.phone);
                                setValue("address", comp.address || "");
                                setValue("companyId", comp.id);
                                setIsCompanyComboboxOpen(false);
                              }}
                              className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-zinc-450 shrink-0" />
                                <span className="font-semibold text-zinc-900 dark:text-zinc-150">
                                  {comp.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-500">{comp.phone}</span>
                            </div>
                          ))}
                          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-1.5 mt-1">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setIsCompanyComboboxOpen(false);
                                setIsAddCompanyDialogOpen(true);
                              }}
                              className="w-full text-xs h-8 text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                            >
                              + Add New Company
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
              {(errors.customerName || errors.phone) && (
                <p className="text-xs font-medium text-red-655 dark:text-red-400">
                  Please select or add a company profile.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billDate" className="text-zinc-900 dark:text-zinc-300">
                  Bill Date
                </Label>
                <Input
                  id="billDate"
                  type="date"
                  {...register("billDate")}
                  className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-zinc-900 dark:text-zinc-300">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Additional details or payment terms..."
                rows={2}
                {...register("notes")}
                className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 resize-none"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
              <Label className="text-zinc-900 dark:text-zinc-300 font-semibold">
                Bill / Receipt Image
              </Label>

              {imageUrl ? (
                <div className="relative h-64 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden group bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                  <Image
                    src={imageUrl}
                    alt="Uploaded bill receipt"
                    className="h-full w-full object-contain"
                    width={400}
                    height={300}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={removeImage}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-90 hover:opacity-100 shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-all">
                  <input
                    type="file"
                    id="bill-image-file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="bill-image-file"
                    className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full py-4"
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                    ) : (
                      <Upload className="h-8 w-8 text-zinc-400" />
                    )}
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {uploadingImage ? "Uploading bill image..." : "Upload bill / receipt image"}
                    </span>
                    <span className="text-xs text-zinc-500">PNG, JPG, GIF up to 5MB</span>
                  </label>
                </div>
              )}
              {imageError && (
                <p className="text-xs font-medium text-red-655 dark:text-red-400">
                  {imageError}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Bill Products & Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                Search & Add Product Item
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-6 space-y-1.5 relative" ref={comboboxRef}>
                  <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                    Search Product Title
                  </Label>
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                    <Input
                      placeholder="Type product title to search..."
                      value={searchProductQuery}
                      onChange={(e) => {
                        setSearchProductQuery(e.target.value);
                        setCustomProductName(e.target.value);
                        setIsComboboxOpen(true);
                      }}
                      onFocus={() => setIsComboboxOpen(true)}
                      className="pl-9 pr-20 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                      {selectedProduct && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDrawerProduct(selectedProduct)}
                                  className="h-7 w-7 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <TooltipContent>
                              <p>View Product Info (Left Drawer)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {searchProductQuery && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleClearSelectedProduct}
                          className="h-7 w-7 text-zinc-400 hover:text-zinc-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <ChevronDown className="h-4 w-4 text-zinc-400 pointer-events-none mr-1" />
                    </div>
                  </div>

                  {isComboboxOpen && (
                    <div className="absolute z-50 left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg p-1 space-y-1">
                      {filteredProducts.length === 0 ? (
                        <div className="p-3 text-xs text-center space-y-2">
                          <p className="text-zinc-500">No matching product found.</p>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                              setIsComboboxOpen(false);
                              setIsAddProductDialogOpen(true);
                            }}
                            className="w-full text-xs h-8"
                          >
                            Add New Product
                          </Button>
                        </div>
                      ) : (
                        <>
                          {filteredProducts.map((prod) => {
                            const isAlreadyAdded = items.some(
                              (item) => item.productId === prod.id || item.productName.trim().toLowerCase() === prod.title.trim().toLowerCase()
                            );
                            return (
                              <div
                                key={prod.id}
                                onClick={() => handleSelectProduct(prod)}
                                className={cn(
                                  "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-xs",
                                  selectedProductId === prod.id && "bg-zinc-100 dark:bg-zinc-900 font-semibold"
                                )}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="relative h-8 w-8 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 flex items-center justify-center">
                                    {prod.image ? (
                                      <Image
                                        src={prod.image}
                                        alt={prod.title}
                                        fill
                                        className="object-cover"
                                        sizes="32px"
                                      />
                                    ) : (
                                      <Package className="h-4 w-4 text-zinc-400" />
                                    )}
                                  </div>
                                  <div className="truncate flex items-center gap-2">
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                      {prod.title}
                                    </p>
                                    {isAlreadyAdded && (
                                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                                        In Bill
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right shrink-0 ml-2">
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    Initial: ${prod.initPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-1.5 mt-1">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setIsComboboxOpen(false);
                                setIsAddProductDialogOpen(true);
                              }}
                              className="w-full text-xs h-8 text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                            >
                              + Add New Product
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <Label className="text-xs text-zinc-600 dark:text-zinc-400">Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={productQty}
                    onChange={(e) => setProductQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <Label className="text-xs text-zinc-600 dark:text-zinc-400">Initial Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productUnitPrice}
                    onChange={(e) => setProductUnitPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {selectedProduct ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Selected Product:</span>
                    <Badge variant="outline" className="text-xs font-semibold">
                      {selectedProduct.title} (${selectedProduct.initPrice.toFixed(2)})
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDrawerProduct(selectedProduct)}
                      className="text-xs h-7 gap-1 text-zinc-600 dark:text-zinc-400"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Left Drawer
                    </Button>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-400">
                    Entering incoming product data
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleAddProductItem}
                  variant="secondary"
                  className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>

              {duplicateWarning && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-medium flex items-center justify-between">
                  <span>{duplicateWarning}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setDuplicateWarning(null)} className="h-6 w-6 p-0 text-amber-600">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}

              {errors.items && (
              <p className="text-xs font-medium text-red-655 dark:text-red-400">
                {errors.items.message}
              </p>
            )}

            {fields.length > 0 ? (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-zinc-50 dark:bg-zinc-900/30">
                    <TableRow className="border-zinc-200 dark:border-zinc-800">
                      <TableHead>#</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total Price</TableHead>
                      <TableHead className="text-right w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((fieldItem, index) => {
                      const currentItem = items[index] || {};
                      const itemTotal = (currentItem.quantity || 0) * (currentItem.unitPrice || 0);

                      return (
                        <TableRow key={fieldItem.id} className="border-zinc-200 dark:border-zinc-800">
                          <TableCell className="text-xs text-zinc-400">{index + 1}</TableCell>
                          <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {currentItem.productName}
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              min="1"
                              value={currentItem.quantity}
                              onChange={(e) => {
                                const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                                setValue(`items.${index}.quantity`, val, { shouldValidate: true });
                                setValue(`items.${index}.totalPrice`, val * (currentItem.unitPrice || 0));
                              }}
                              className="w-20 ml-auto h-8 text-right bg-zinc-50 dark:bg-zinc-900/30"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={currentItem.unitPrice}
                              onChange={(e) => {
                                const val = Math.max(0, parseFloat(e.target.value) || 0);
                                setValue(`items.${index}.unitPrice`, val, { shouldValidate: true });
                                setValue(`items.${index}.initialPrice`, val, { shouldValidate: true });
                                setValue(`items.${index}.totalPrice`, (currentItem.quantity || 0) * val);
                              }}
                              className="w-24 ml-auto h-8 text-right bg-zinc-50 dark:bg-zinc-900/30"
                            />
                          </TableCell>
                          <TableCell className="text-right font-bold text-zinc-900 dark:text-zinc-50">
                            ${itemTotal.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger
                                    render={
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleViewTableItem(currentItem)}
                                        className="h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    }
                                  />
                                  <TooltipContent>
                                    <p>View Product Dialog</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center border-dashed border-2 border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 text-sm">
                No products added yet. Use the search form above to add items to this bill.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Payment Calculation & Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paidAmount" className="text-zinc-900 dark:text-zinc-300">
                  Paid Amount ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="paidAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("paidAmount", { valueAsNumber: true })}
                  className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 font-semibold"
                />
                {errors.paidAmount && (
                  <p className="text-xs font-medium text-red-655 dark:text-red-400">
                    {errors.paidAmount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-900 dark:text-zinc-300">Total Amount ($)</Label>
                <div className="h-10 px-3 flex items-center rounded-md bg-zinc-100 dark:bg-zinc-900 font-bold text-zinc-900 dark:text-zinc-50">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-900 dark:text-zinc-300">Remaining Amount ($)</Label>
                <div className="h-10 px-3 flex items-center rounded-md bg-zinc-100 dark:bg-zinc-900 font-bold text-amber-600 dark:text-amber-400">
                  ${remainingAmount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Calculated Payment Status:
              </span>
              <Badge
                className={cn(
                  "px-3 py-1 text-sm font-semibold",
                  paymentStatus === "Paid"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : paymentStatus === "Partially Paid"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                )}
              >
                {paymentStatus}
              </Badge>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-3">
              <Link
                href="/dashboard/bills?tab=bill-management"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50",
                  isSubmitting && "pointer-events-none opacity-50"
                )}
              >
                Cancel
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting || uploadingImage || fields.length === 0}
                className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Bill"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Sheet open={!!drawerProduct} onOpenChange={(open) => !open && setDrawerProduct(null)}>
        <SheetContent side="left" className="w-[85%] sm:max-w-md p-6 overflow-y-auto bg-white dark:bg-zinc-950">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Product Information
            </SheetTitle>
            <SheetDescription className="text-xs text-zinc-500">
              Detailed pricing and specification details
            </SheetDescription>
          </SheetHeader>

          {drawerProduct && (
            <div className="space-y-6 pt-4">
              {drawerProduct.image ? (
                <div className="relative h-56 w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <Image
                    src={drawerProduct.image}
                    alt={drawerProduct.title}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
              ) : (
                <div className="h-40 w-full rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40">
                  <Package className="h-10 w-10" />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {drawerProduct.category?.title || "Uncategorized"}
                  </Badge>
                  {drawerProduct.brand && (
                    <Badge variant="outline">Brand: {drawerProduct.brand}</Badge>
                  )}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {drawerProduct.title}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-zinc-450 uppercase block">
                    Initial Price
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ${drawerProduct.initPrice.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-zinc-450 uppercase block">
                    Middle Price
                  </span>
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    ${drawerProduct.middlePrice.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-zinc-450 uppercase block">
                    Final Price
                  </span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    ${drawerProduct.finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-500 uppercase block">
                  Current Stock
                </span>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {drawerProduct.stock} units
                </p>
              </div>

              {drawerProduct.description && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-zinc-500 uppercase block">
                    Description
                  </span>
                  <p className="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400 whitespace-pre-wrap">
                    {drawerProduct.description}
                  </p>
                </div>
              )}

              {drawerProduct.info && Array.isArray(drawerProduct.info) && drawerProduct.info.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-500 uppercase block">
                    Specifications
                  </span>
                  <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
                    {(drawerProduct.info as { title: string; description: string }[]).map((item, idx) => (
                      <div key={idx} className="grid grid-cols-3 p-2 bg-zinc-50/50 dark:bg-zinc-900/10">
                        <span className="font-medium text-zinc-500 col-span-1">{item.title}</span>
                        <span className="text-zinc-900 dark:text-zinc-100 col-span-2">{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

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
              {dialogProductCatalog && dialogProductCatalog.image && (
                <div className="relative h-48 w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <Image
                    src={dialogProductCatalog.image}
                    alt={dialogItem.productName}
                    fill
                    className="object-cover"
                    sizes="350px"
                  />
                </div>
              )}

              {dialogProductCatalog && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="secondary">
                    Category: {dialogProductCatalog.category?.title || "Uncategorized"}
                  </Badge>
                  {dialogProductCatalog.brand && (
                    <Badge variant="outline">Brand: {dialogProductCatalog.brand}</Badge>
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

              {dialogProductCatalog && dialogProductCatalog.description && (
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">Description:</span>
                  <p className="text-zinc-500 dark:text-zinc-400">{dialogProductCatalog.description}</p>
                </div>
              )}

              {!dialogProductCatalog && (
                <div className="py-2 text-xs text-zinc-500">
                  Custom line item: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{dialogItem.productName}</span>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCompanyDialogOpen} onOpenChange={setIsAddCompanyDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Add New Company
            </DialogTitle>
          </DialogHeader>
          <CompanyForm
            onSubmit={handleCreateCompanySubmit}
            onCancel={() => setIsAddCompanyDialogOpen(false)}
            isSubmitting={isCreatingCompany}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Add New Product
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreateProductSubmit}
            onCancel={() => setIsAddProductDialogOpen(false)}
            isSubmitting={isCreatingProduct}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
