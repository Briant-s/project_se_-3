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
