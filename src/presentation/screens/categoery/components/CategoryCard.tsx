"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Edit2, Trash2, FolderOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/presentation/components/language-provider";
import { Category } from "@/domain/entities/Category";

interface CategoryCardProps {
  category: Category;
  onDeleteInitiated: (id: string) => void;
}

export function CategoryCard({
  category,
  onDeleteInitiated,
}: CategoryCardProps) {
  const { t, dir } = useLanguage();

  return (
    <Card dir={dir} className="group overflow-hidden pt-0 border border-zinc-200 dark:border-zinc-855 bg-white dark:bg-zinc-955 hover:shadow-lg hover:-translate-y-1 hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col h-[350px] gap-0">
      <div className="relative h-44 flex-1 w-full bg-zinc-50 dark:bg-zinc-900/30 overflow-hidden flex items-center justify-center border-b border-zinc-100 dark:border-zinc-900/60">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            width={600}
            height={400}
          />
        ) : (
          <div className="flex flex-col items-center">
            <FolderOpen className="h-10 w-10 text-zinc-300 dark:text-zinc-700 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] my-1 uppercase tracking-wider font-semibold text-zinc-450 dark:text-zinc-655">
              {t("no_image", { defaultValue: "No Image" })}
            </span>
          </div>
        )}
      </div>

      <CardHeader className="py-0 my-0">
        <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 transition-colors text-start">
          {category.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 my-0 py-3 flex flex-col">
        <p className="text-sm text-zinc-555 dark:text-zinc-400 line-clamp-2 leading-relaxed text-start">
          {category.description ||
            t("no_description_provided", {
              defaultValue: "No description provided for this category.",
            })}
        </p>

        {Array.isArray(category.brand) && category.brand.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {category.brand.slice(0, 2).map((b: string, i: number) => (
              <span
                key={i}
                className="text-[10px] font-medium bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/50"
              >
                {b}
              </span>
            ))}
            {category.brand.length > 2 && (
              <Popover>
                <PopoverTrigger className="text-[10px] font-medium bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-455 px-2 py-0.5 rounded-full transition-colors cursor-pointer outline-none">
                  +{category.brand.length - 2} {t("more", { defaultValue: "more" })}
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-md z-50">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-1 text-start">
                      {t("brands")}
                    </h4>
                    <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
                      {category.brand.map((b: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/50"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-0 px-4 border-t border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/20 flex justify-end gap-1 shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href={`/dashboard/categories/${category.id}?tab=category-management`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-400",
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
                  href={`/dashboard/categories/${category.id}/edit?tab=category-management`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-400",
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
                  onClick={() => onDeleteInitiated(category.id)}
                  className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-955/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
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
      </CardFooter>
    </Card>
  );
}
