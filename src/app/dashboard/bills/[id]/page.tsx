"use client";

import React from "react";
import { BillDetailScreen } from "@/presentation/screens/bill/BillDetailScreen";
import { useLanguage } from "@/presentation/components/language-provider";
import { DashboardHeader } from "@/presentation/components/DashboardHeader";

export default function BillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { t, dir } = useLanguage();

  return (
    <div dir={dir} className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/10">
      <DashboardHeader title={t("bill_management")} />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <BillDetailScreen id={id} />
        </div>
      </main>
    </div>
  );
}
