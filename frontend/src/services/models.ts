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
  health_status?: string;
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
  businessAge?: number;
  ownerDob?: string;
  businessLocation?: string;
  businessBankAcc?: string | null;
  businessSector?: string | null;
  businessType?: string | null;
  totalEmployees?: number | string | null;
  storeType?: string | null;
  monthlyAverageIncome?: number;
  monthlyAverageProfitLoss?: number;
  businessAssets?: string;
  isOtherKredit?: string | null;
  umkmUnlockLevel?: string | null;
  businessContactNumber?: string | null;
  businessEmail?: string | null;
  isProfitable?: boolean;
}

export interface BusinessProfileForm {
  businessName: string;
  ownerName: string;
  businessAge: number | "";
  ownerDob: string;
  businessLocation: string;
  businessBankAcc: string | null;
  businessSector: string | null;
  businessType: string | null;
  totalEmployees: number | "";
  storeType: string | null;
  monthlyAverageIncome: number | "";
  monthlyAverageProfitLoss: number | "";
  businessAssets: string;
  isOtherKredit: string | null;
  umkmUnlockLevel: string | null;
  businessContactNumber: string;
  businessEmail: string;
  isProfitable: boolean | null;
  businessAgeYears: number | "";
  businessAgeMonths: number | "";
}

export interface Credit {
  creditID: number;
  creditType: string;
  interestRatePerYear: number;
  minBusinessAge: number;
  minLimit: number;
  maxLimit: number;
  minTenorMonth: number;
  maxTenorMonth: number;
  needsCollateral: boolean;
}

export interface Competitors {
  competitorID?: string | number;
  name?: string;
  strength?: string;
  weakness?: string;
}

export interface Products {
  productID?: string | number;
  name?: string;
  description?: string;
  price?: string;
}

export interface BusinessProposal {
  proposalID: string;
  user_id?: string;
  businessID?: number;
  created_at?: string;
  // status?: string;
  // dateGenerated?: string;
  businessName?: string;
  businessDescription?: string;
  competitors?: Competitors[];
  products?: Products[];
  visi?: string;
  misi?: string;
  targetPasar?: string;
  psikografi?: string;
  trenPasar?: string;
  strategiPemasaran?: string;
  pelayananPelanggan?: string;
  jamOperasional?: string;
  jumlahStaff?: string | number;
  supplier?: string;
  prosesOperasional?: string;
  modalAwal?: string;
  targetPendapatan?: string;
  analisa?: string;
  kesimpulan?: string;
}

export interface AIBusinessProposal extends BusinessProposal {
  AIProposalID?: string;
  proposalID: string;
  user_id?: string;
  businessID?: number;
  created_at?: string;
  // status?: string;
  // dateGenerated?: string;
  businessName?: string;
  businessDescription?: string;
  competitors?: Competitors[];
  products?: Products[];
  visi?: string;
  misi?: string;
  targetPasar?: string;
  psikografi?: string;
  trenPasar?: string;
  strategiPemasaran?: string;
  pelayananPelanggan?: string;
  jamOperasional?: string;
  jumlahStaff?: string | number;
  supplier?: string;
  prosesOperasional?: string;
  modalAwal?: string;
  targetPendapatan?: string;
  analisa?: string;
  kesimpulan?: string;
}

export type BusinessProposalInput = Omit<
  BusinessProposal,
  "proposalID" | "user_id" | "businessID" | "dateGenerated" | "status"
>;
