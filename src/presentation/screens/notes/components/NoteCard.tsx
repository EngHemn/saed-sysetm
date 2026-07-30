"use client";

import React from "react";
import { Eye, Edit2, Trash2, Calendar, Clock } from "lucide-react";
import { Note } from "@/domain/entities/Note";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/presentation/components/language-provider";

interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDeleteInitiated: (id: string) => void;
}

export function NoteCard({
  note,
  onView,
  onEdit,
  onDeleteInitiated,
}: NoteCardProps) {
  const { t, dir } = useLanguage();

  return (
    <Card
      className="group overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[240px]"
      dir={dir}
    >
      <div className="text-start">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-550 line-clamp-1 text-start">
            {note.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-zinc-550 dark:text-zinc-400 line-clamp-4 leading-relaxed whitespace-pre-wrap text-start">
            {note.description}
          </p>
        </CardContent>
      </div>
      <CardFooter className="p-3 border-t border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/20 flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-0.5 text-[10px] text-zinc-450 dark:text-zinc-500 font-medium text-start">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-zinc-400 dark:text-zinc-500 shrink-0" />
            <span>
              {t("created", { defaultValue: "Created" })}:{" "}
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-zinc-400 dark:text-zinc-500 shrink-0" />
            <span>
              {t("updated", { defaultValue: "Updated" })}:{" "}
              {new Date(note.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(note)}
                    className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-655 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                }
              />
              <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-955 rounded-lg p-1.5 text-[10px]">
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
                    onClick={() => onEdit(note)}
                    className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-655 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                }
              />
              <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-955 rounded-lg p-1.5 text-[10px]">
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
                    onClick={() => onDeleteInitiated(note.id)}
                    className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-955/20 text-red-650 dark:text-red-400 hover:text-red-750 dark:hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                }
              />
              <TooltipContent className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-955 rounded-lg p-1.5 text-[10px]">
                <p>{t("delete")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
