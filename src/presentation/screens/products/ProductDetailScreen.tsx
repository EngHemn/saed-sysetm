"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, AlertTriangle } from "lucide-react";
import { useProduct } from "@/presentation/hooks/useProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProductDetailScreenProps {
  id: string;
}

export function ProductDetailScreen({ id }: ProductDetailScreenProps) {
  const { product, isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-4 rounded-full mb-4">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Product Not Found
        </h3>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm mb-4">
          {error?.message ||
            "The product you are trying to view does not exist or has been removed."}
        </p>
        <Link
          href="/dashboard/products?tab=product-management"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const infoList =
    (product.info as { title: string; description: string }[] | null) || [];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products?tab=product-management"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9 text-zinc-600 dark:text-zinc-400 flex items-center justify-center",
            )}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Product Details
            </h1>
            <p className="text-sm text-zinc-555 dark:text-zinc-400">
              View catalog details
            </p>
          </div>
        </div>
        <Link
          href={`/dashboard/products/${product.id}/edit?tab=product-management`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-550 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-2",
          )}
        >
          <Edit2 className="h-4 w-4" />
          Edit Product
        </Link>
      </div>

      <Card className="border border-zinc-200 pt-0 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        {product.image && (
          <div className="relative h-72 w-full bg-zinc-50 dark:bg-zinc-900/30 border-b border-zinc-150 dark:border-zinc-900 flex items-center justify-center overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 650px"
              priority
            />
          </div>
        )}

        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800"
            >
              {product.category?.title || "Uncategorized"}
            </Badge>
            {product.brand && (
              <Badge
                variant="outline"
                className="border-zinc-250 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400"
              >
                Brand: {product.brand}
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {product.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-900">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">
                Initial Price
              </span>
              <span className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
                ${product.initPrice.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">
                Middle Price
              </span>
              <span className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
                ${product.middlePrice.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">
                Final Price
              </span>
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                ${product.finalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {product.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Description
              </h4>
              <p className="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {infoList.length > 0 && (
            <div className="space-y-3 border-t border-zinc-150 dark:border-zinc-900 pt-4">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Specifications
              </h4>
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                {infoList.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 text-sm px-4 py-2.5 bg-zinc-50/20 dark:bg-zinc-900/5"
                  >
                    <span className="font-medium text-zinc-500 dark:text-zinc-400 col-span-1">
                      {item.title}
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-150 col-span-2">
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-zinc-150 dark:border-zinc-900 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-450 dark:text-zinc-500">
            <span>
              Created on: {new Date(product.createdAt).toLocaleDateString()}
            </span>
            <span>
              Last updated: {new Date(product.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
