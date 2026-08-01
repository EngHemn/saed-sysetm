"use client";

import React from "react";
import { Eye } from "lucide-react";
import { BillItem } from "@/domain/entities/Bill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/presentation/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BillDetailItemsTableProps {
  items: BillItem[];
  setDialogItem: (item: BillItem | null) => void;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillDetailItemsTable({
  items,
  setDialogItem,
  dir,
  t,
}: BillDetailItemsTableProps) {
  const { formatCurrency } = useLanguage();
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 text-left">
          {t("products_table", { defaultValue: "Products Table" })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/30">
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"}`}>
                  #
                </TableHead>
                <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"}`}>
                  {t("product_name")}
                </TableHead>
                <TableHead className={`${dir === "rtl" ? "text-left" : "text-right"}`}>
                  {t("quantity")}
                </TableHead>
                <TableHead className={`${dir === "rtl" ? "text-left" : "text-right"}`}>
                  {t("unit_price")}
                </TableHead>
                <TableHead className={`${dir === "rtl" ? "text-left" : "text-right"}`}>
                  {t("total_price")}
                </TableHead>
                <TableHead className={`${dir === "rtl" ? "text-left" : "text-right"} w-20`}>
                  {t("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className="border-zinc-200 dark:border-zinc-800"
                >
                  <TableCell
                    className={`text-xs text-zinc-400 ${
                      dir === "rtl" ? "text-right" : "text-left"
                    }`}
                  >
                    {idx + 1}
                  </TableCell>
                  <TableCell
                    className={`font-semibold text-zinc-900 dark:text-zinc-100 ${
                      dir === "rtl" ? "text-right" : "text-left"
                    }`}
                  >
                    {item.productName}
                  </TableCell>
                  <TableCell
                    className={`font-medium text-zinc-700 dark:text-zinc-300 ${
                      dir === "rtl" ? "text-left" : "text-right"
                    }`}
                  >
                    {item.quantity}
                  </TableCell>
                  <TableCell
                    className={`text-zinc-650 dark:text-zinc-400 ${
                      dir === "rtl" ? "text-left" : "text-right"
                    }`}
                  >
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell
                    className={`font-bold text-zinc-900 dark:text-zinc-50 ${
                      dir === "rtl" ? "text-left" : "text-right"
                    }`}
                  >
                    {formatCurrency(item.totalPrice)}
                  </TableCell>
                  <TableCell className={`${dir === "rtl" ? "text-left" : "text-right"}`}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setDialogItem(item)}
                              className="h-8 w-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 mx-auto"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <TooltipContent>
                          <p>{t("view")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
