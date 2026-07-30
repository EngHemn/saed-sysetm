"use client";

import React, { use } from "react";
import { ProductFormScreen } from "@/presentation/screens/products/ProductFormScreen";
import { useLanguage } from "@/presentation/components/language-provider";
import { DashboardHeader } from "@/presentation/components/DashboardHeader";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, dir } = useLanguage();

  return (
    <div dir={dir} className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/10">
      <DashboardHeader title={t("product_management")} />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <ProductFormScreen id={id} />
        </div>
      </main>
    </div>
  );
}

