"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Building2, Phone, MapPin, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bill } from "@/domain/entities/Bill";

interface BillDetailOverviewCardProps {
  bill: Bill;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillDetailOverviewCard({
  bill,
  t,
}: BillDetailOverviewCardProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 text-left">
          {t("general_information", { defaultValue: "General Information" })}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-400 text-left">
            <Building2 className="h-4 w-4 text-zinc-400 shrink-0" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
              {t("company_name")}:
            </span>
            <span>{bill.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-400 text-left">
            <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
              {t("phone")}:
            </span>
            <span>{bill.phone}</span>
          </div>
          {bill.address && (
            <div className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-400 text-left">
              <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                {t("address")}:
              </span>
              <span>{bill.address}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-400 text-left">
            <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
              {t("bill_date")}:
            </span>
            <span>{new Date(bill.billDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-400 text-left">
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
              {t("created_at", { defaultValue: "Created At" })}:
            </span>
            <span>{new Date(bill.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-400 text-left">
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
              {t("updated_at", { defaultValue: "Updated At" })}:
            </span>
            <span>{new Date(bill.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        {bill.image && (
          <div className="md:col-span-2 pt-3 border-t border-zinc-100 dark:border-zinc-900 text-left">
            <span className="font-semibold text-zinc-900 dark:text-zinc-200 block text-sm mb-2">
              {t("bill_image", { defaultValue: "Receipt / Bill Image" })}:
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
          <div className="md:col-span-2 pt-3 border-t border-zinc-100 dark:border-zinc-900 text-left">
            <div className="flex items-start gap-2 text-sm text-zinc-650 dark:text-zinc-400">
              <FileText className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">
                  {t("note")}:
                </span>
                <p className="mt-1 whitespace-pre-wrap">{bill.notes}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
