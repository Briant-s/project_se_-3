export interface AmortEntry {
  amortID?: number;
  user_id?: number;
  creditID?: number;
  businessID?: number;
  created_at?: string;
  title?: string;
  tenorMonth?: number;
  totalInstallment?: number;
  principalAmount?: number;
}

export interface AmortFormValues {
  title: string;
  tenorMonth: number;
  totalInstallment: number;
  principalAmount: number;
  loanType: "KUR_SUPER_MIKRO" | "KUR_MIKRO" | "KUR_KECIL";
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
  umkmUnlockLevel?: string | null;
  businessContactNumber?: string | null;
  businessEmail?: string | null;
}
