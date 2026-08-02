"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  Search,
  ChevronDown,
  Building,
  Phone,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BillInput } from "@/domain/schemas/bill";
import { BillFormImageUpload } from "./BillFormImageUpload";

interface CompanyItem {
  id: string;
  name: string;
  phone: string;
  address?: string;
}

interface BillFormCompanySectionProps {
  selectedCompanyName: string;
  selectedCompanyPhone: string;
  selectedCompanyAddress?: string | null;
  companySearchQuery: string;
  setCompanySearchQuery: (query: string) => void;
  isCompanyComboboxOpen: boolean;
  setIsCompanyComboboxOpen: (open: boolean) => void;
  companyComboboxRef: React.RefObject<HTMLDivElement | null>;
  companyList: any[];
  setIsAddCompanyDialogOpen: (open: boolean) => void;
  setValue: (field: any, val: any) => void;
  register: UseFormRegister<BillInput>;
  errors: FieldErrors<BillInput>;
  imageUrl?: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<string | null> | Promise<void>;
  removeImage: () => void;
  uploadingImage: boolean;
  isCompressing?: boolean;
  isImageLoading?: boolean;
  imageError: string | null;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillFormCompanySection({
  selectedCompanyName,
  selectedCompanyPhone,
  selectedCompanyAddress,
  companySearchQuery,
  setCompanySearchQuery,
  isCompanyComboboxOpen,
  setIsCompanyComboboxOpen,
  companyComboboxRef,
  companyList,
  setIsAddCompanyDialogOpen,
  setValue,
  register,
  errors,
  imageUrl,
  handleImageUpload,
  removeImage,
  uploadingImage,
  isCompressing,
  isImageLoading,
  imageError,
  dir,
  t,
}: BillFormCompanySectionProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 text-start">
          {t("company_receipt_info", {
            defaultValue: "Company Information & Receipt Image",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-zinc-900 dark:text-zinc-300 font-semibold text-start block">
            {t("company_search", { defaultValue: "Company Search" })}{" "}
            <span className="text-red-500">*</span>
          </Label>
          {selectedCompanyName ? (
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                  <Building className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-zinc-955 dark:text-zinc-50 text-xs text-start">
                    {selectedCompanyName}
                  </h4>
                  <div className="flex items-center gap-3 text-zinc-555 dark:text-zinc-400 text-[10px] text-start">
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
                className="h-8 text-xs border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 cursor-pointer"
              >
                {t("change_company", { defaultValue: "Change Company" })}
              </Button>
            </div>
          ) : (
            <div className="relative" ref={companyComboboxRef}>
              <div className="relative flex items-center">
                <Search
                  className={`absolute ${
                    dir === "rtl" ? "right-3" : "left-3"
                  } top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none`}
                />
                <Input
                  placeholder={t("company_search_placeholder", {
                    defaultValue: "Type company name or phone to search...",
                  })}
                  value={companySearchQuery}
                  onChange={(e) => {
                    setCompanySearchQuery(e.target.value);
                    setIsCompanyComboboxOpen(true);
                  }}
                  onFocus={() => setIsCompanyComboboxOpen(true)}
                  className={`${
                    dir === "rtl" ? "pr-9 pl-10" : "pl-9 pr-10"
                  } bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-start`}
                />
                <ChevronDown
                  className={`absolute ${
                    dir === "rtl" ? "left-3" : "right-3"
                  } top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none`}
                />
              </div>

              {isCompanyComboboxOpen && (
                <div className="absolute z-50 left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 shadow-lg p-1 space-y-1">
                  {companyList.length === 0 ? (
                    <div className="p-3 text-xs text-center space-y-2">
                      <p className="text-zinc-500">
                        {t("no_company_matching", {
                          defaultValue:
                            "No company found matching your query.",
                        })}
                      </p>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setIsCompanyComboboxOpen(false);
                          setIsAddCompanyDialogOpen(true);
                        }}
                        className="w-full text-xs h-8 cursor-pointer"
                      >
                        {t("add_company")}
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
                          <span className="text-[10px] text-zinc-500">
                            {comp.phone}
                          </span>
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
                          className="w-full text-xs h-8 text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                        >
                          + {t("add_company")}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {(errors.customerName || errors.phone) && (
            <p className="text-xs font-medium text-red-655 dark:text-red-400 text-start">
              {t("select_company_required", {
                defaultValue: "Please select or add a company profile.",
              })}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="billDate"
              className="text-zinc-900 dark:text-zinc-300 text-start block"
            >
              {t("bill_date")}
            </Label>
            <Input
              id="billDate"
              type="date"
              {...register("billDate")}
              className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-start"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="notes"
            className="text-zinc-900 dark:text-zinc-300 text-start block"
          >
            {t("note")}
          </Label>
          <Textarea
            id="notes"
            placeholder={t("note")}
            rows={2}
            {...register("notes")}
            className="bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 resize-none text-start"
          />
        </div>

        <BillFormImageUpload
          imageUrl={imageUrl}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          uploadingImage={uploadingImage}
          isCompressing={isCompressing}
          isImageLoading={isImageLoading}
          imageError={imageError}
          t={t}
        />
      </CardContent>
    </Card>
  );
}
