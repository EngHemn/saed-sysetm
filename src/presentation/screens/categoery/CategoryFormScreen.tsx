"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoryFormViewModel } from "@/presentation/viewmodels/useCategoryFormViewModel";
import { CategoryFormHeader } from "./components/CategoryFormHeader";
import { CategoryFormFields } from "./components/CategoryFormFields";

interface CategoryFormScreenProps {
  id?: string;
}

export function CategoryFormScreen({ id }: CategoryFormScreenProps) {
  const viewModel = useCategoryFormViewModel(id);

  if (viewModel.isEditMode && viewModel.isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto" dir={viewModel.dir}>
      <CategoryFormHeader
        isEditMode={viewModel.isEditMode}
        dir={viewModel.dir}
        t={viewModel.t}
      />

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 text-left">
            {viewModel.t("category_details")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryFormFields {...viewModel} />
        </CardContent>
      </Card>
    </div>
  );
}
