"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useBillFormViewModel } from "@/presentation/viewmodels/useBillFormViewModel";
import { BillFormHeader } from "./components/BillFormHeader";
import { BillFormCompanySection } from "./components/BillFormCompanySection";
import { BillFormProductsSection } from "./components/BillFormProductsSection";
import { BillFormSummarySection } from "./components/BillFormSummarySection";
import { BillFormProductSheet } from "./components/BillFormProductSheet";
import { BillFormModals } from "./components/BillFormModals";

interface BillFormScreenProps {
  id?: string;
}

export function BillFormScreen({ id }: BillFormScreenProps) {
  const {
    isEditMode,
    isFetching,
    register,
    handleSubmit,
    setValue,
    fields,
    remove,
    errors,
    isSubmitting,
    selectedProductId,
    searchProductQuery,
    setSearchProductQuery,
    setCustomProductName,
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
    productQty,
    setProductQty,
    productUnitPrice,
    setProductUnitPrice,
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
  } = useBillFormViewModel(id);

  if (isEditMode && isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir={dir}>
      <BillFormHeader
        isEditMode={isEditMode}
        formSuccessMessage={formSuccessMessage}
        dir={dir}
        t={t}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <BillFormCompanySection
          selectedCompanyName={selectedCompanyName}
          selectedCompanyPhone={selectedCompanyPhone}
          selectedCompanyAddress={selectedCompanyAddress}
          companySearchQuery={companySearchQuery}
          setCompanySearchQuery={setCompanySearchQuery}
          isCompanyComboboxOpen={isCompanyComboboxOpen}
          setIsCompanyComboboxOpen={setIsCompanyComboboxOpen}
          companyComboboxRef={companyComboboxRef}
          companyList={companyList}
          setIsAddCompanyDialogOpen={setIsAddCompanyDialogOpen}
          setValue={setValue}
          register={register}
          errors={errors}
          imageUrl={imageUrl}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          uploadingImage={uploadingImage}
          imageError={imageError}
          dir={dir}
          t={t}
        />

        <BillFormProductsSection
          comboboxRef={comboboxRef}
          searchProductQuery={searchProductQuery}
          setSearchProductQuery={setSearchProductQuery}
          setCustomProductName={setCustomProductName}
          isComboboxOpen={isComboboxOpen}
          setIsComboboxOpen={setIsComboboxOpen}
          setIsAddProductDialogOpen={setIsAddProductDialogOpen}
          selectedProduct={selectedProduct}
          selectedProductId={selectedProductId}
          setDrawerProduct={setDrawerProduct}
          handleClearSelectedProduct={handleClearSelectedProduct}
          filteredProducts={filteredProducts}
          handleSelectProduct={handleSelectProduct}
          items={items}
          fields={fields}
          productQty={productQty}
          setProductQty={setProductQty}
          productUnitPrice={productUnitPrice}
          setProductUnitPrice={setProductUnitPrice}
          handleAddProductItem={handleAddProductItem}
          duplicateWarning={duplicateWarning}
          setDuplicateWarning={setDuplicateWarning}
          errors={errors}
          setValue={setValue}
          remove={remove}
          handleViewTableItem={handleViewTableItem}
          getValidationError={getValidationError}
          dir={dir}
          language={language}
          t={t}
        />

        <BillFormSummarySection
          register={register}
          errors={errors}
          totalAmount={totalAmount}
          remainingAmount={remainingAmount}
          paymentStatus={paymentStatus}
          isSubmitting={isSubmitting}
          uploadingImage={uploadingImage}
          fieldsLength={fields.length}
          getValidationError={getValidationError}
          dir={dir}
          t={t}
        />
      </form>

      <BillFormProductSheet
        drawerProduct={drawerProduct}
        setDrawerProduct={setDrawerProduct}
        dir={dir}
        language={language}
        t={t}
      />

      <BillFormModals
        dialogItem={dialogItem}
        setDialogItem={setDialogItem}
        dialogProductCatalog={dialogProductCatalog}
        isAddCompanyDialogOpen={isAddCompanyDialogOpen}
        setIsAddCompanyDialogOpen={setIsAddCompanyDialogOpen}
        handleCreateCompanySubmit={handleCreateCompanySubmit}
        isCreatingCompany={isCreatingCompany}
        isAddProductDialogOpen={isAddProductDialogOpen}
        setIsAddProductDialogOpen={setIsAddProductDialogOpen}
        handleCreateProductSubmit={handleCreateProductSubmit}
        isCreatingProduct={isCreatingProduct}
        dir={dir}
        language={language}
        t={t}
      />
    </div>
  );
}
