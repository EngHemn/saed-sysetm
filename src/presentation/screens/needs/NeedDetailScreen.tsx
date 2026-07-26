"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Loader2, Package, Calendar } from "lucide-react";
import Link from "next/link";
import { useNeed } from "@/presentation/hooks/useNeeds";
import { useProduct } from "@/presentation/hooks/useProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatDate } from "date-fns";

interface NeedDetailScreenProps {
  id: string;
}

function ProductLinkCard({ productId }: { productId: string }) {
  const { product, isLoading } = useProduct(productId);

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin text-zinc-550" />;
  }

  if (!product) return null;

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
          <Package className="h-4 w-4" />
          Linked Product
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        {product.image && (
          <div className="relative h-16 w-16 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white">
            <Image
              src={product.image}
              alt={product.title}
              className="object-cover"
              fill
              sizes="64px"
            />
          </div>
        )}
        <div className="space-y-1">
          <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{product.title}</h4>
          <p className="text-xs text-zinc-555 dark:text-zinc-400">
            Category: {product.category?.title || "Uncategorized"} | Brand: {product.brand || "—"}
          </p>
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">
            Stock: {product.stock} | Price: ${product.finalPrice.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function NeedDetailScreen({ id }: NeedDetailScreenProps) {
  const router = useRouter();
  const { need, isLoading, error } = useNeed(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-550" />
      </div>
    );
  }

  if (error || !need) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-4 rounded-full mb-4">
          <Package className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-550 mb-2">
          Need Request Not Found
        </h3>
        <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm">
          {error?.message || "The requested need details could not be found or does not exist."}
        </p>
        <Link
          href="/dashboard/needs?tab=needs-management"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50")}
        >
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/needs?tab=needs-management"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9 text-zinc-650 dark:text-zinc-400 flex items-center justify-center"
            )}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Need Details
            </h1>
            <p className="text-sm text-zinc-550 dark:text-zinc-400">
              View stored details and linked product information
            </p>
          </div>
        </div>

        <Link
          href={`/dashboard/needs/${need.id}/edit?tab=needs-management`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-zinc-250 dark:border-zinc-850 hover:bg-zinc-50 text-zinc-950 dark:text-zinc-50 flex items-center gap-2"
          )}
        >
          <Edit2 className="h-4 w-4" />
          Edit Need
        </Link>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <div>
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2",
                need.priority === "High" && "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
                need.priority === "Medium" && "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
                need.priority === "Low" && "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              )}
            >
              {need.priority} Priority
            </span>
            <CardTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {need.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-450 dark:text-zinc-500">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(new Date(need.createdAt), "PPP p")}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-450">Description</h3>
            <p className="text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {need.description || "No description provided."}
            </p>
          </div>

          {need.image && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-450">Attachment</h3>
              <div className="relative h-80 w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <Image
                  src={need.image}
                  alt={need.title}
                  className="object-contain"
                  fill
                  sizes="100vw"
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
