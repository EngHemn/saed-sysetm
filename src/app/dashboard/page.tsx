"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { menuItems } from "@/presentation/components/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/presentation/components/theme-toggle";

import { useLanguage } from "@/presentation/components/language-provider";
import { DashboardHeader } from "@/presentation/components/DashboardHeader";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "product-management";
  const activeItem = menuItems.find((item) => item.id === activeTab) || menuItems[0];
  const { t, dir } = useLanguage();

  React.useEffect(() => {
    if (activeTab === "category-management") {
      router.replace("/dashboard/categories?tab=category-management");
    } else if (activeTab === "product-management") {
      router.replace("/dashboard/products?tab=product-management");
    } else if (activeTab === "bill-management") {
      router.replace("/dashboard/bills?tab=bill-management");
    } else if (activeTab === "note") {
      router.replace("/dashboard/notes?tab=note");
    } else if (activeTab === "needs-management") {
      router.replace("/dashboard/needs?tab=needs-management");
    }
  }, [activeTab, router]);

  const activeTitle = t(activeItem.id.replace(/-/g, "_"));

  return (
    <div dir={dir} className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50 dark:bg-zinc-900/40">
      <DashboardHeader title={activeTitle} />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
          <Card className="w-full max-w-2xl border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm py-16 px-8 text-center">
            <CardContent className="space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <activeItem.icon className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {activeTitle}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  {t("no_content_desc")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/40">
        <div className="animate-pulse text-lg text-zinc-500 dark:text-zinc-400">{t("loading")}</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
