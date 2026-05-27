export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  // Output: Rp 8.100.000,00
};

export const formatPercent = (value: number) => {
  return `${value.toFixed(0)}%`;
  // Output: 15% (Adjust toFixed(1) if you want decimals like 15.5%)
};
