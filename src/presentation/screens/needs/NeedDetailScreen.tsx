"use client";

import React from "react";
import { ArrowLeft, Edit2, Loader2, Package, Calendar } from "lucide-react";
import Link from "next/link";
import { useNeed } from "@/presentation/hooks/useNeeds";
import { useProduct } from "@/presentation/hooks/useProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn, getLocalizedValue } from "@/lib/utils";
import Image from "next/image";
import { useLanguage } from "@/presentation/components/language-provider";

interface NeedDetailScreenProps {
  id: string;
}

function ProductLinkCard({ productId }: { productId: string }) {
  const { product, isLoading } = useProduct(productId);
  const { t, dir, language, formatCurrency } = useLanguage();

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin text-zinc-555 shrink-0" />;
  }

  if (!product) return null;

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 shadow-none" dir={dir}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-700 dark:text-zinc-350 text-start">
          <Package className="h-4 w-4 shrink-0" />
          {t("linked_product", { defaultValue: "Linked Product" })}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        {product.image && (
          <div className="relative h-16 w-16 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white shrink-0">
            <Image
              src={product.image}
              alt={getLocalizedValue(product.title, language)}
              className="object-cover"
              fill
              sizes="64px"
            />
          </div>
        )}
        <div className="space-y-1 text-start">
          <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{getLocalizedValue(product.title, language)}</h4>
          <p className="text-xs text-zinc-555 dark:text-zinc-400">
            {t("category")}: {product.category?.title || "Uncategorized"} | {t("brand")}: {product.brand || "—"}
          </p>
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">
            {t("stock", { defaultValue: "Current Stock" })}: {product.stock} | {t("price", { defaultValue: "Price" })}: {formatCurrency(product.finalPrice)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

import { useNeedDetailsViewModel } from "@/presentation/viewmodels/useNeedDetailsViewModel";

export function NeedDetailScreen({ id }: NeedDetailScreenProps) {
  const { need, isLoading, error, translatePriority, t, dir } =
    useNeedDetailsViewModel(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" dir={dir}>
        <Loader2 className="h-8 w-8 animate-spin text-zinc-555 shrink-0" />
      </div>
    );
  }

  if (error || !need) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]" dir={dir}>
        <div className="bg-red-50 dark:bg-red-950/20 text-red-655 dark:text-red-400 p-4 rounded-full mb-4 shrink-0">
          <Package className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          {t("need_not_found", { defaultValue: "Need Request Not Found" })}
        </h3>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm">
          {error?.message || t("need_not_found_desc", { defaultValue: "The requested need details could not be found or does not exist." })}
        </p>
        <Link
          href="/dashboard/needs?tab=needs-management"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50")}
        >
          {t("back_to_list")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto" dir={dir}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/needs?tab=needs-management"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9 text-zinc-650 dark:text-zinc-400 flex items-center justify-center"
            )}
          >
            <ArrowLeft className={cn("h-5 w-5", dir === "rtl" && "rotate-180")} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-550 text-start">
              {t("need_details")}
            </h1>
            <p className="text-sm text-zinc-555 dark:text-zinc-400 text-start">
              {t("need_details_desc", { defaultValue: "View stored details and linked product information" })}
            </p>
          </div>
        </div>

        <Link
          href={`/dashboard/needs/${need.id}/edit?tab=needs-management`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-zinc-250 dark:border-zinc-800 hover:bg-zinc-50 text-zinc-955 dark:text-zinc-50 flex items-center gap-2 cursor-pointer"
          )}
        >
          <Edit2 className="h-4 w-4 shrink-0" />
          {t("edit_need")}
        </Link>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <div className="text-start">
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2",
                need.priority === "High" && "bg-red-550/10 text-red-650 dark:bg-red-955/20 dark:text-red-400 border border-red-500/20",
                need.priority === "Medium" && "bg-amber-500/10 text-amber-650 dark:bg-amber-955/20 dark:text-amber-400 border border-amber-500/20",
                need.priority === "Low" && "bg-zinc-500/10 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-350 border border-zinc-200 dark:border-zinc-800"
              )}
            >
              {translatePriority(need.priority)} {t("priority")}
            </span>
            <CardTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50 text-start">
              {need.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-450 dark:text-zinc-500">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{new Date(need.createdAt).toLocaleString()}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6 text-start">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-450">{t("description")}</h3>
            <p className="text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {need.description || t("no_description_provided", { defaultValue: "No description provided." })}
            </p>
          </div>

          {need.image && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-450">{t("attachment", { defaultValue: "Attachment" })}</h3>
              <div className="relative h-80 w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                <Image
                  src={need.image}
                  alt={need.title}
                  className="h-full w-full object-contain"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          )}

          {need.productId && (
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <ProductLinkCard productId={need.productId} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
