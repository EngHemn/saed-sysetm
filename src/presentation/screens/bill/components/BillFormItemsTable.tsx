"use client";

import React from "react";
import { UseFieldArrayRemove } from "react-hook-form";
import { Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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

interface BillFormItemsTableProps {
  fields: Record<string, any>[];
  items: any[];
  setValue: (field: any, val: any, options?: any) => void;
  remove: UseFieldArrayRemove;
  handleViewTableItem: (item: any) => void;
  dir: "ltr" | "rtl";
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function BillFormItemsTable({
  fields,
  items,
  setValue,
  remove,
  handleViewTableItem,
  dir,
  t,
}: BillFormItemsTableProps) {
  if (fields.length === 0) {
    return (
      <div className="p-8 text-center border-dashed border-2 border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 text-sm">
        {t("no_bill_items_placeholder", {
          defaultValue:
            "No products added yet. Use the search form above to add items to this bill.",
        })}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-50 dark:bg-zinc-900/30">
          <TableRow className="border-zinc-200 dark:border-zinc-800">
            <TableHead
              className={`${dir === "rtl" ? "text-right" : "text-left"}`}
            >
              #
            </TableHead>
            <TableHead
              className={`${dir === "rtl" ? "text-right" : "text-left"}`}
            >
              {t("product_name")}
            </TableHead>
            <TableHead
              className={`${dir === "rtl" ? "text-left" : "text-right"}`}
            >
              {t("quantity")}
            </TableHead>
            <TableHead
              className={`${dir === "rtl" ? "text-left" : "text-right"}`}
            >
              {t("unit_price")}
            </TableHead>
            <TableHead
              className={`${dir === "rtl" ? "text-left" : "text-right"}`}
            >
              {t("total_price")}
            </TableHead>
            <TableHead
              className={`${dir === "rtl" ? "text-left" : "text-right"} w-24`}
            >
              {t("actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((fieldItem, index) => {
            const currentItem = items[index] || {};
            const itemTotal =
              (currentItem.quantity || 0) * (currentItem.unitPrice || 0);

            return (
              <TableRow
                key={fieldItem.id}
                className="border-zinc-200 dark:border-zinc-800"
              >
                <TableCell
                  className={`text-xs text-zinc-400 ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  className={`font-semibold text-zinc-900 dark:text-zinc-100 ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {currentItem.productName}
                </TableCell>
                <TableCell
                  className={`${dir === "rtl" ? "text-left" : "text-right"}`}
                >
                  <Input
                    type="number"
                    min="1"
                    value={currentItem.quantity}
                    onChange={(e) => {
                      const val = Math.max(
                        1,
                        parseInt(e.target.value, 10) || 1
                      );
                      setValue(`items.${index}.quantity`, val, {
                        shouldValidate: true,
                      });
                      setValue(
                        `items.${index}.totalPrice`,
                        val * (currentItem.unitPrice || 0)
                      );
                    }}
                    className="w-20 ml-auto h-8 text-right bg-zinc-50 dark:bg-zinc-900/30 font-semibold"
                  />
                </TableCell>
                <TableCell
                  className={`${dir === "rtl" ? "text-left" : "text-right"}`}
                >
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentItem.unitPrice}
                    onChange={(e) => {
                      const val = Math.max(
                        0,
                        parseFloat(e.target.value) || 0
                      );
                      setValue(`items.${index}.unitPrice`, val, {
                        shouldValidate: true,
                      });
                      setValue(`items.${index}.initialPrice`, val, {
                        shouldValidate: true,
                      });
                      setValue(
                        `items.${index}.totalPrice`,
                        (currentItem.quantity || 0) * val
                      );
                    }}
                    className="w-24 ml-auto h-8 text-right bg-zinc-50 dark:bg-zinc-900/30 font-semibold"
                  />
                </TableCell>
                <TableCell
                  className={`font-bold text-zinc-900 dark:text-zinc-50 ${
                    dir === "rtl" ? "text-left" : "text-right"
                  }`}
                >
                  ${itemTotal.toFixed(2)}
                </TableCell>
                <TableCell
                  className={`${dir === "rtl" ? "text-left" : "text-right"}`}
                >
                  <div
                    className={`flex ${
                      dir === "rtl" ? "justify-start" : "justify-end"
                    } items-center gap-1`}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewTableItem(currentItem)}
                              className="h-8 w-8 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
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

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-955/20 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
