"use client";

import React from "react";
import Image from "next/image";
import { Building, Phone, MapPin, Eye, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Company } from "@/domain/entities/Company";

interface CompanyCardProps {
  company: Company;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  dir?: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function CompanyCard({
  company,
  onView,
  onEdit,
  onDelete,
  dir,
  t,
}: CompanyCardProps) {
  const totalBillsAmount = company.bills
    ? company.bills.reduce((sum: number, b: { totalAmount: number }) => sum + b.totalAmount, 0)
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.002, y: -1 }}
      className="flex rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 p-4 shadow-xs overflow-hidden gap-4 transition-all duration-300"
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
          <h3 className="font-extrabold text-zinc-950 dark:text-zinc-50 text-sm truncate leading-snug text-left">
            {company.name}
          </h3>
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-[10px] text-left">
            <Phone className="h-3 w-3 shrink-0" />
            <span>{company.phone}</span>
          </div>
          {company.address && (
            <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[9px] truncate text-left">
              <MapPin className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate">{company.address}</span>
            </div>
          )}
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-left">
            <span className="text-zinc-500 font-medium">
              {t("total_bills", { defaultValue: "Total Bills:" })}
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              ${totalBillsAmount.toFixed(2)}
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
                    onClick={() => onView(company.id)}
                    className="h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg p-1.5 text-[9px]">
                <p>{t("view")}</p>
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
                    onClick={() => onEdit(company.id)}
                    className="h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg p-1.5 text-[9px]">
                <p>{t("edit")}</p>
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
                    onClick={() => onDelete(company.id)}
                    className="h-8 w-8 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-955/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg p-1.5 text-[9px]">
                <p>{t("delete")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
}
