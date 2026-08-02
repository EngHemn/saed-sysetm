"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Edit2, Trash2, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Need } from "@/domain/entities/Need";

interface NeedListStoredNeedsProps {
  needs: Need[];
  searchQuery: string;
  priorityFilter: string;
  clearFilters: () => void;
  setDeleteTargetId: (id: string | null) => void;
  translatePriority: (priority: string) => string;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function NeedListStoredNeeds({
  needs,
  searchQuery,
  priorityFilter,
  clearFilters,
  setDeleteTargetId,
  translatePriority,
  dir,
  t,
}: NeedListStoredNeedsProps) {
  if (needs.length === 0) {
    return (
      <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-955/40 py-12 px-6 text-center rounded-xl">
        <CardContent className="space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">
            <ClipboardList className="h-6 w-6 shrink-0" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 text-center">
              {t("no_needs_found")}
            </h3>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto text-center">
              {t("no_needs_recorded_desc", {
                defaultValue:
                  "There are no active need items matching your search or selection filters.",
              })}
            </p>
          </div>
          {(searchQuery || priorityFilter !== "all") && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-1 border-zinc-200 dark:border-zinc-800 rounded-lg h-8 text-xs cursor-pointer"
            >
              {t("clear_filters")}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1  md:grid-cols-2 gap-3">
      {needs.map((need) => (
        <motion.div
          key={need.id}
          whileHover={{ scale: 1.002, y: -1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-2 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70  dark:bg-zinc-950 shadow-xs hover:shadow-xs transition-all duration-300"
        >
          <div className="flex items-center p-0 gap-3 flex-1 min-w-0">
            {need.image ? (
              <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50">
                <Image
                  src={need.image}
                  alt={need.title}
                  className="object-cover"
                  fill
                  sizes="48px"
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-455 dark:text-zinc-500 shrink-0 border border-zinc-200/50 dark:border-zinc-800/50">
                <ClipboardList className="h-5 w-5 shrink-0" />
              </div>
            )}

            <div className="space-y-1 min-w-0 text-start">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase",
                    need.priority === "High" &&
                      "bg-red-500/10 text-red-650 dark:bg-red-955/20 dark:text-red-400 border border-red-500/20",
                    need.priority === "Medium" &&
                      "bg-amber-500/10 text-amber-650 dark:bg-amber-955/20 dark:text-amber-400 border border-amber-500/20",
                    need.priority === "Low" &&
                      "bg-zinc-500/10 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-350 border border-zinc-200 dark:border-zinc-800",
                  )}
                >
                  {translatePriority(need.priority)}
                </span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-550 font-semibold">
                  {new Date(need.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-zinc-950 dark:text-zinc-50 truncate text-sm leading-snug">
                {need.title}
              </h3>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-550 line-clamp-1 max-w-[280px]">
                {need.description ||
                  t("no_details_provided", {
                    defaultValue: "No specific details provided.",
                  })}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-0.5 sm:self-center shrink-0 ${
              dir === "rtl" ? "self-start" : "self-end"
            }`}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link
                      href={`/dashboard/needs/${need.id}?tab=needs-management`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors",
                      )}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  }
                />
                <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-955 rounded-lg p-1.5 text-[9px]">
                  <p>{t("view")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link
                      href={`/dashboard/needs/${need.id}/edit?tab=needs-management`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors",
                      )}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  }
                />
                <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-955 rounded-lg p-1.5 text-[9px]">
                  <p>{t("edit_request", { defaultValue: "Edit Request" })}</p>
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
                      onClick={() => setDeleteTargetId(need.id)}
                      className="h-8 w-8 text-red-655 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-955/20 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
                <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-955 rounded-lg p-1.5 text-[9px]">
                  <p>
                    {t("delete_request", { defaultValue: "Delete Request" })}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
