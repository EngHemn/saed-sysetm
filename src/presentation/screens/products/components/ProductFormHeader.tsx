"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductFormHeaderProps {
  isEditMode: boolean;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function ProductFormHeader({
  isEditMode,
  dir,
  t,
}: ProductFormHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/dashboard/products?tab=product-management"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-9 w-9 text-zinc-650 dark:text-zinc-400 flex items-center justify-center"
        )}
      >
        <ArrowLeft className={cn("h-5 w-5", dir === "rtl" && "rotate-180")} />
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {isEditMode ? t("edit_product") : t("add_product")}
        </h1>
        <p className="text-sm text-zinc-550 dark:text-zinc-400">
          {isEditMode
            ? t("edit_product_desc", {
                defaultValue: "Update product pricing and inventory details",
              })
            : t("add_product_desc", {
                defaultValue: "Create a new product in the store",
              })}
        </p>
      </div>
    </div>
  );
}
