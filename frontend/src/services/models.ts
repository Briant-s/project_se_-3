export interface AmortEntry {
  amort_id?: number;
  created_at?: string;
  user_id?: string;
  title: string;
  tenor_month: number;
  total_installment: number;
}

export interface AmortFormValues {
  title: string;
  tenor_month: number;
  total_installment: number;
}

export interface BusinessProfile {
  user_id?: string;
  businessName?: string;
  ownerName?: string;
  businessAge?: string | null;
  ownerDob?: string;
  businessLocation?: string;
  businessBankAcc?: string | null;
  businessSector?: string | null;
  businessType?: string | null;
  totalEmployees?: number | string | null;
  storeType?: string | null;
  monthlyAverageIncome?: string | null;
  monthlyAverageProfitLoss?: string | null;
  businessAssets?: string;
  isOtherKredit?: string | null;
}
