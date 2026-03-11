export const mockBusinessProfile = {
  // Business Identity
  identity: {
    namaBisnis: "Warung Maju Jaya",
    tanggalBerdiri: "2019-03-15",
    namaOwner: "Budi Santoso",
    tanggalLahirOwner: "1985-06-22",
    nib: "1234567890123",
    npwp: "12.345.678.9-012.000",
    lokasiBisnis: "Jl. Pahlawan No. 45, Depok, Jawa Barat 16412",

    bankAccount: {
      bank: "BCA",
      noRekening: "1234567890",
      atasNama: "Budi Santoso",
    },
  },

  // Operational Business
  operational: {
    sektorBisnis: "F&B",
    jenisBisnis: "Produk",
    jumlahKaryawan: 5,
    jenisToko: "both", // "online" | "offline" | "both"
  },

  // Finansial
  finansial: {
    rataRataLaba: 8500000,
    rataRataOmset: 35000000,
    tipePembayaran: ["Cash", "Transfer Bank", "QRIS"],
    aset: [
      { nama: "Motor operasional", nilai: 15000000 },
      { nama: "Peralatan dapur", nilai: 15000000 },
      { nama: "Stok barang", nilai: 5000000 },
    ],
    kredit: [
      {
        nama: "Cicilan peralatan dapur",
        cicilanPerBulan: 500000,
        sisaBulan: 12,
      },
    ],
    kurDiBankLain: false,
  },
};
