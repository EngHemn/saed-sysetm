"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "./language-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, dir } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" className="h-9 px-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer flex items-center gap-2">
          <div className="relative h-4 w-4 flex items-center justify-center">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 shrink-0 animate-none" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 shrink-0 animate-none" />
          </div>
          <span className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
          <Languages className="h-4 w-4 text-zinc-550 dark:text-zinc-400 shrink-0" />
          <span className="sr-only">Toggle preferences</span>
        </Button>
      } />
      <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 min-w-[160px]" dir={dir}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 text-left px-2.5 py-1.5 select-none">
            {t("theme", { defaultValue: "Theme" })}
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setTheme("light")} className={cn("flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer font-medium text-xs px-2.5 py-1.5", theme === "light" && "font-bold text-zinc-955 dark:text-zinc-50")}>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-zinc-500 shrink-0" />
              <span>Light</span>
            </div>
            {theme === "light" && <span className="h-1.5 w-1.5 rounded-full bg-zinc-950 dark:bg-zinc-50" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className={cn("flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer font-medium text-xs px-2.5 py-1.5", theme === "dark" && "font-bold text-zinc-955 dark:text-zinc-50")}>
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-zinc-500 shrink-0" />
              <span>Dark</span>
            </div>
            {theme === "dark" && <span className="h-1.5 w-1.5 rounded-full bg-zinc-955 dark:bg-zinc-50" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className={cn("flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer font-medium text-xs px-2.5 py-1.5", theme === "system" && "font-bold text-zinc-955 dark:text-zinc-50")}>
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-zinc-500 shrink-0" />
              <span>System</span>
            </div>
            {theme === "system" && <span className="h-1.5 w-1.5 rounded-full bg-zinc-955 dark:bg-zinc-50" />}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 text-left px-2.5 py-1.5 select-none">
            {t("language", { defaultValue: "Language" })}
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setLanguage("en")} className={cn("flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer font-medium text-xs px-2.5 py-1.5", language === "en" && "font-bold text-zinc-955 dark:text-zinc-50")}>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-zinc-500 shrink-0" />
              <span>English</span>
            </div>
            {language === "en" && <span className="h-1.5 w-1.5 rounded-full bg-zinc-955 dark:bg-zinc-50" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("ku")} className={cn("flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer font-medium text-xs px-2.5 py-1.5", language === "ku" && "font-bold text-zinc-955 dark:text-zinc-50")}>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-zinc-500 shrink-0" />
              <span>کوردی (Kurdish)</span>
            </div>
            {language === "ku" && <span className="h-1.5 w-1.5 rounded-full bg-zinc-955 dark:bg-zinc-50" />}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
