import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { billSchema, BillInput } from "@/domain/schemas/bill";
import { useBills, useBill } from "@/presentation/hooks/useBills";
import { useProducts } from "@/presentation/hooks/useProducts";
import { useCompanies } from "@/presentation/hooks/useCompanies";
import { CompanyInput } from "@/domain/schemas/company";
import { ProductInput } from "@/domain/schemas/product";
import { Product } from "@/domain/entities/Product";
import { getLocalizedValue } from "@/lib/utils";
import { useLanguage } from "@/presentation/components/language-provider";

export interface DialogTableItem {
  productId?: string | null;
  productName: string;
  initialPrice: number;
  middlePrice: number;
  finalPrice: number;
}

export function useBillFormViewModel(id?: string) {
  const router = useRouter();
  const isEditMode = !!id;
  const { t, dir, language } = useLanguage();

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
  const [dialogItem, setDialogItem] = useState<DialogTableItem | null>(null);

  const dialogProductCatalog = useMemo(() => {
    if (!dialogItem || !dialogItem.productId) return null;
    return products.find((p) => p.id === dialogItem.productId) || null;
  }, [dialogItem, products]);

  const form = useForm<BillInput>({
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

  const { register, handleSubmit, setValue, watch, control, reset, setError, formState } = form;

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
    return products.filter((p) => {
      const localizedTitle = getLocalizedValue(p.title, language).toLowerCase();
      return (
        localizedTitle.includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category?.title && p.category.title.toLowerCase().includes(q))
      );
    });
  }, [products, searchProductQuery, language]);

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

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [setValue]);

  const removeImage = useCallback(() => {
    setValue("image", "", { shouldValidate: true });
  }, [setValue]);

  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const handleSelectProduct = useCallback((prod: Product) => {
    setSelectedProductId(prod.id);
    setCustomProductName(getLocalizedValue(prod.title, language));
    setProductUnitPrice(prod.initPrice);
    setSearchProductQuery(getLocalizedValue(prod.title, language));
    setIsComboboxOpen(false);
  }, [language]);

  const handleClearSelectedProduct = useCallback(() => {
    setSelectedProductId("");
    setCustomProductName("");
    setProductUnitPrice(0);
    setSearchProductQuery("");
  }, []);

  const handleAddProductItem = useCallback(() => {
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

      setDuplicateWarning(
        t("bill_item_updated_qty", {
          name: existingItem.productName,
          qty: newQty,
          defaultValue: `"${existingItem.productName}" has been updated to quantity ${newQty}`,
        })
      );
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
  }, [customProductName, productQty, productUnitPrice, items, selectedProductId, selectedProduct, setValue, append, t]);

  const handleViewTableItem = useCallback(
    (item: {
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
    },
    []
  );

  const [isCreatingCompany, setIsCreatingCompany] = useState(false);

  const handleCreateCompanySubmit = useCallback(
    async (data: CompanyInput) => {
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
    },
    [setValue]
  );

  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const handleCreateProductSubmit = useCallback(
    async (data: ProductInput) => {
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
        const newProduct = await res.json();
        await refetchProducts();
        setSelectedProductId(newProduct.id);
        setCustomProductName(newProduct.title);
        setProductUnitPrice(newProduct.initPrice);
        setSearchProductQuery(newProduct.title);
        setIsAddProductDialogOpen(false);
      } catch (e: unknown) {
        console.error(e);
      } finally {
        setIsCreatingProduct(false);
      }
    },
    [refetchProducts]
  );

  const getValidationError = (message: string | undefined) => {
    if (!message) return undefined;
    if (message === "Company name is required") return t("company_name_required");
    if (message === "Phone number is required") return t("phone_required");
    if (message === "Paid amount must be at least 0")
      return t("paid_amount_min_0", { defaultValue: "Paid amount must be at least 0" });
    if (message === "At least one product is required")
      return t("items_min_1", { defaultValue: "At least one product is required" });
    if (message === "Paid amount cannot exceed total bill amount")
      return t("paid_amount_max_exceed", { defaultValue: "Paid amount cannot exceed total bill amount" });
    if (message === "A paid bill cannot be changed to unpaid")
      return t("paid_bill_no_unpaid", { defaultValue: "A paid bill cannot be changed to unpaid" });
    return t(message);
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
      setFormSuccessMessage(
        isEditMode
          ? t("bill_updated_success", { defaultValue: "Bill updated successfully!" })
          : t("bill_created_success", { defaultValue: "Bill created successfully!" })
      );
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

  return {
    isEditMode,
    isFetching,
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    control,
    fields,
    remove,
    errors: formState.errors,
    isSubmitting,
    selectedProductId,
    setSelectedProductId,
    customProductName,
    setCustomProductName,
    productQty,
    setProductQty,
    productUnitPrice,
    setProductUnitPrice,
    searchProductQuery,
    setSearchProductQuery,
    isComboboxOpen,
    setIsComboboxOpen,
    comboboxRef,
    companySearchQuery,
    setCompanySearchQuery,
    isCompanyComboboxOpen,
    setIsCompanyComboboxOpen,
    companyComboboxRef,
    isAddCompanyDialogOpen,
    setIsAddCompanyDialogOpen,
    isAddProductDialogOpen,
    setIsAddProductDialogOpen,
    companyList,
    uploadingImage,
    imageError,
    formSuccessMessage,
    drawerProduct,
    setDrawerProduct,
    dialogItem,
    setDialogItem,
    dialogProductCatalog,
    items,
    paidAmount,
    imageUrl,
    selectedCompanyName,
    selectedCompanyPhone,
    selectedCompanyAddress,
    totalAmount,
    remainingAmount,
    paymentStatus,
    filteredProducts,
    selectedProduct,
    handleImageUpload,
    removeImage,
    duplicateWarning,
    setDuplicateWarning,
    handleSelectProduct,
    handleClearSelectedProduct,
    handleAddProductItem,
    handleViewTableItem,
    isCreatingCompany,
    handleCreateCompanySubmit,
    isCreatingProduct,
    handleCreateProductSubmit,
    getValidationError,
    t,
    dir,
    language,
  };
}

export function useAddBillViewModel() {
  return useBillFormViewModel(undefined);
}

export function useEditBillViewModel(id: string) {
  return useBillFormViewModel(id);
}
