import { useCallback } from "react";
import { useNeed } from "@/presentation/hooks/useNeeds";
import { useLanguage } from "@/presentation/components/language-provider";

export function useNeedDetailsViewModel(id: string) {
  const { need, isLoading, error } = useNeed(id);
  const { t, dir } = useLanguage();

  const translatePriority = useCallback(
    (priority: string) => {
      if (priority === "Low") return t("low");
      if (priority === "Medium") return t("medium");
      if (priority === "High") return t("high");
      if (priority === "Urgent") return t("urgent");
      return priority;
    },
    [t]
  );

  return {
    need,
    isLoading,
    error,
    translatePriority,
    t,
    dir,
  };
}
