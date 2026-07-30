import { useMemo } from "react";
import { useProduct } from "@/presentation/hooks/useProducts";
import { useLanguage } from "@/presentation/components/language-provider";
import { getLocalizedValue } from "@/lib/utils";

export interface SpecInfoItem {
  title: string;
  description: string;
}

export function useProductDetailsViewModel(id: string) {
  const { product, isLoading, error } = useProduct(id);
  const { t, dir, language } = useLanguage();

  const infoList: SpecInfoItem[] = useMemo(() => {
    if (!product || !product.info) return [];
    const infoArr = product.info as Array<{ title: string; description: string }>;
    return infoArr.map((item) => ({
      title: getLocalizedValue(item.title, language),
      description: getLocalizedValue(item.description, language),
    }));
  }, [product, language]);

  return {
    product,
    isLoading,
    error,
    infoList,
    t,
    dir,
    language,
  };
}
