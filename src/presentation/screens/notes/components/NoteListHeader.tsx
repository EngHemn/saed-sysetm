"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface NoteListHeaderProps {
  openAddForm: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function NoteListHeader({ openAddForm, t }: NoteListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-start">
          {t("notes_title")}
        </h1>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 text-start">
          {t("notes_subtitle")}
        </p>
      </div>
      <Button
        onClick={openAddForm}
        className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-200 flex items-center gap-2 cursor-pointer"
      >
        <Plus className="h-4 w-4 shrink-0" />
        {t("add_note")}
      </Button>
    </div>
  );
}

export function NoteListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card
          key={i}
          className="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-[240px] flex flex-col justify-between"
        >
          <div className="p-4 space-y-3 flex-1">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <CardFooter className="p-3 border-t border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/20 flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
