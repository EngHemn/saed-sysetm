"use client";

import React, { Suspense, use } from "react";
import { NeedDetailScreen } from "@/presentation/screens/needs/NeedDetailScreen";
import { useLanguage } from "@/presentation/components/language-provider";
import { DashboardHeader } from "@/presentation/components/DashboardHeader";

function NeedDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, dir } = useLanguage();

  return (
    <div dir={dir} className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/10">
      <DashboardHeader title={t("need_management")} />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <NeedDetailScreen id={id} />
        </div>
      </main>
    </div>
  );
}

export default function NeedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLanguage();
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/10">
        <div className="animate-pulse text-lg text-zinc-550 dark:text-zinc-400">{t("loading")}</div>
      </div>
    }>
      <NeedDetailContent params={params} />
    </Suspense>
  );
}
