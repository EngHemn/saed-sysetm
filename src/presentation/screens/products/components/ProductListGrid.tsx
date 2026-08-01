"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Edit2, Trash2, Package, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getLocalizedValue } from "@/lib/utils";
import { Product } from "@/domain/entities/Product";
import { useLanguage } from "@/presentation/components/language-provider";

interface ProductListGridProps {
  products: Product[];
  isTogglingAlert: boolean;
  togglingAlertId?: string | null;
  handleToggleAlert: (id: string, current: boolean) => Promise<void>;
  setDeleteTargetId: (id: string | null) => void;
  language: "en" | "ku";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function ProductListGrid({
  products,
  isTogglingAlert,
  togglingAlertId,
  handleToggleAlert,
  setDeleteTargetId,
  language,
  t,
}: ProductListGridProps) {
  const { formatCurrency } = useLanguage();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 mb-6">
      {products.map((product) => {
        const isToggling = isTogglingAlert && togglingAlertId === product.id;
        return (
          <Card
            key={product.id}
            className="overflow-hidden py-0 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-md transition-all duration-300 flex flex-row items-stretch h-40"
          >
            <div className="relative w-32 sm:w-36 md:w-44 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border-r rtl:border-r-0 rtl:border-l border-zinc-150 dark:border-zinc-800/80">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={getLocalizedValue(product.title, language)}
                  className="object-cover"
                  fill
                  sizes="150px"
                />
              ) : (
                <Package className="h-10 w-10 text-zinc-350 dark:text-zinc-700" />
              )}
              <div className="absolute top-2 right-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="secondary"
                          size="icon"
                          disabled={isToggling}
                          onClick={() =>
                            handleToggleAlert(product.id, product.actionAlert)
                          }
                          className={cn(
                            "h-7 w-7 rounded-full bg-white/85 dark:bg-zinc-900/80 backdrop-blur-xs shadow-xs border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-900 cursor-pointer flex items-center justify-center",
                            product.actionAlert
                              ? "text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
                              : "text-zinc-400 hover:text-zinc-500 dark:text-zinc-650"
                          )}
                        >
                          {isToggling ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <AlertTriangle
                              className={cn(
                                "h-3.5 w-3.5",
                                product.actionAlert && "fill-current"
                              )}
                            />
                          )}
                        </Button>
                      }
                    />
                    <TooltipContent>
                      <p>
                        {product.actionAlert
                          ? t("disable_action_alert")
                          : t("enable_action_alert")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between gap-2 min-w-0">
              <div className="space-y-1 min-w-0">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm truncate text-start">
                  {getLocalizedValue(product.title, language)}
                </h3>
                <div className="flex flex-col gap-0.5 text-xs text-start">
                  <span className="font-medium text-zinc-500 dark:text-zinc-400 truncate">
                    {product.category?.title || "Uncategorized"}
                  </span>
                  {product.brand && (
                    <span className="text-zinc-450 dark:text-zinc-500 truncate">
                      {t("brand")}: {product.brand}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-zinc-100 dark:border-zinc-900">
                  <div className="flex flex-col text-start">
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase">
                      {t("middle_price")}
                    </span>
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-455">
                      {formatCurrency(product.middlePrice)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end text-start">
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase">
                      {t("final_price")}
                    </span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(product.finalPrice)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-1 border-t border-zinc-100 dark:border-zinc-900">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Link
                          href={`/dashboard/products/${product.id}?tab=product-management`}
                          className={cn(
                            buttonVariants({
                              variant: "ghost",
                              size: "icon",
                            }),
                            "h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          )}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      }
                    />
                    <TooltipContent>
                      <p>{t("view")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Link
                          href={`/dashboard/products/${product.id}/edit?tab=product-management`}
                          className={cn(
                            buttonVariants({
                              variant: "ghost",
                              size: "icon",
                            }),
                            "h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          )}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                      }
                    />
                    <TooltipContent>
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
                          onClick={() => setDeleteTargetId(product.id)}
                          className="h-8 w-8 text-red-655 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <TooltipContent>
                      <p>{t("delete")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
