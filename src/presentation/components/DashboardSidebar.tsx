"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package,
  FolderTree,
  ReceiptText,
  StickyNote,
  ClipboardList,
  LogOut,
  Building,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { useLanguage } from "./language-provider";

export const menuItems = [
  {
    id: "product-management",
    title: "Product Management",
    icon: Package,
  },
  {
    id: "category-management",
    title: "Category Management",
    icon: FolderTree,
  },
  {
    id: "company-management",
    title: "Company Management",
    icon: Building,
  },
  {
    id: "bill-management",
    title: "Bill Management",
    icon: ReceiptText,
  },
  {
    id: "note",
    title: "Note",
    icon: StickyNote,
  },
  {
    id: "needs-management",
    title: "Needs Management",
    icon: ClipboardList,
  },
];

export function DashboardSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "product-management";
  const { t, dir } = useLanguage();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleTabChange = (id: string) => {
    if (isMobile) {
      setOpenMobile(false);
    }
    if (id === "category-management") {
      router.push(`/dashboard/categories?tab=category-management`);
    } else if (id === "product-management") {
      router.push(`/dashboard/products?tab=product-management`);
    } else if (id === "company-management") {
      router.push(`/dashboard/companies?tab=company-management`);
    } else if (id === "bill-management") {
      router.push(`/dashboard/bills?tab=bill-management`);
    } else if (id === "note") {
      router.push(`/dashboard/notes?tab=note`);
    } else if (id === "needs-management") {
      router.push(`/dashboard/needs?tab=needs-management`);
    } else {
      router.push(`/dashboard?tab=${id}`);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/auth");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sidebar side={dir === "rtl" ? "right" : "left"} className="pt-4 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-550">
      <SidebarHeader className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950 font-bold text-lg">
            S
          </div>
          <span className="font-bold text-lg text-zinc-950 dark:text-zinc-50">{t("system_title")}</span>
        </div>
        <SidebarTrigger className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900" />
      </SidebarHeader>

      <SidebarContent className="p-3 bg-white dark:bg-zinc-950">
        <SidebarMenu className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const itemTitle = t(item.id.replace(/-/g, "_"));

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={isActive}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs font-semibold border border-zinc-200 dark:border-zinc-800"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-50"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400 dark:text-zinc-500"}`} />
                  <span className="text-sm font-medium">{itemTitle}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-950">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full flex items-center gap-3 justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-350 py-2.5 px-3 rounded-lg"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">{t("logout")}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

