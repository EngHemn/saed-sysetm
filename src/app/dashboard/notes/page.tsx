"use client";

import React from "react";
import { NoteListScreen } from "@/presentation/screens/notes/NoteListScreen";
import { useLanguage } from "@/presentation/components/language-provider";
import { DashboardHeader } from "@/presentation/components/DashboardHeader";

export default function NotesPage() {
  const { t, dir } = useLanguage();
  return (
    <div dir={dir} className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/10">
      <DashboardHeader title={t("notes_title")} />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <NoteListScreen />
        </div>
      </main>
    </div>
  );
}
