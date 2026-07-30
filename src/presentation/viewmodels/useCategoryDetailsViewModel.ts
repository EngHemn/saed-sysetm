import { useCategory } from "@/presentation/hooks/useCategories";
import { useLanguage } from "@/presentation/components/language-provider";

export function useCategoryDetailsViewModel(id: string) {
  const { category, isLoading, error } = useCategory(id);
  const { t, dir } = useLanguage();

  return {
    category,
    isLoading,
    error,
    t,
    dir,
  };
}
