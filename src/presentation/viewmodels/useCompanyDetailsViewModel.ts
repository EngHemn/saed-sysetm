import { useMemo } from "react";
import { useCompany } from "@/presentation/hooks/useCompanies";
import { useLanguage } from "@/presentation/components/language-provider";

export function useCompanyDetailsViewModel(id: string) {
  const { company, isLoading, error } = useCompany(id);
  const { t, dir } = useLanguage();

  const totalInvoiced = useMemo(() => {
    if (!company || !company.bills) return 0;
    return company.bills.reduce((sum, b) => sum + b.totalAmount, 0);
  }, [company]);

  const totalPaid = useMemo(() => {
    if (!company || !company.bills) return 0;
    return company.bills.reduce((sum, b) => sum + b.paidAmount, 0);
  }, [company]);

  const totalRemaining = useMemo(() => {
    if (!company || !company.bills) return 0;
    return company.bills.reduce((sum, b) => sum + b.remainingAmount, 0);
  }, [company]);

  return {
    company,
    isLoading,
    error,
    totalInvoiced,
    totalPaid,
    totalRemaining,
    t,
    dir,
  };
}
