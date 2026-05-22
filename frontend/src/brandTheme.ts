import { createTheme, rem } from "@mantine/core";
import type { MantineColorsTuple } from "@mantine/core";

const blue: MantineColorsTuple = [
  "#E6F1FB", // 0 – surface / bg tint
  "#CCE3F7", // 1
  "#B5D4F4", // 2
  "#85B7EB", // 3 – light
  "#5799E1", // 4
  "#378ADD", // 5 – brand  ← primaryShade
  "#2272C4", // 6
  "#185FA5", // 7 – strong
  "#0C447C", // 8
  "#042C53", // 9 – deep
];

const teal: MantineColorsTuple = [
  "#E1F5EE", // 0
  "#C2EBE0", // 1
  "#9FE1CB", // 2
  "#5DCAA5", // 3
  "#33B38C", // 4
  "#1D9E75", // 5 – brand  ← primaryShade for teal
  "#158A63", // 6
  "#0F6E56", // 7
  "#085041", // 8
  "#04342C", // 9
];

const purple: MantineColorsTuple = [
  "#EEEDFE", // 0
  "#DDDCFB", // 1
  "#CECBF6", // 2
  "#AFA9EC", // 3
  "#9790E4", // 4
  "#7F77DD", // 5
  "#6A62CB", // 6
  "#534AB7", // 7 – brand (KUR Kecil)
  "#3C3489", // 8
  "#26215C", // 9
];

// Semantic – success (lunas)
const green: MantineColorsTuple = [
  "#EAF3DE", // 0
  "#D5E9BD", // 1
  "#C0DD97", // 2
  "#97C459", // 3
  "#78AE3A", // 4
  "#639922", // 5 – brand
  "#4E8118", // 6
  "#3B6D11", // 7
  "#27500A", // 8
  "#173404", // 9
];

// Semantic – warning (pending / proses)
const amber: MantineColorsTuple = [
  "#FAEEDA", // 0
  "#FAD9A7", // 1
  "#FAC775", // 2
  "#F5AF42", // 3
  "#EF9F27", // 4 – brand
  "#D4881A", // 5
  "#BA7517", // 6
  "#9A5F10", // 7
  "#7A4A09", // 8
  "#412402", // 9
];

// Semantic – danger (overdue / tunggakan)
const red: MantineColorsTuple = [
  "#FCEBEB", // 0
  "#F9D3D3", // 1
  "#F7C1C1", // 2
  "#F09595", // 3
  "#E86868", // 4
  "#E24B4A", // 5
  "#C83535", // 6
  "#A32D2D", // 7 – brand
  "#791F1F", // 8
  "#501313", // 9
];

// Neutral
const gray: MantineColorsTuple = [
  "#F1EFE8", // 0
  "#E2DFD6", // 1
  "#D3D1C7", // 2
  "#B4B2A9", // 3
  "#A09E96", // 4
  "#888780", // 5
  "#747370", // 6
  "#5F5E5A", // 7
  "#444441", // 8
  "#2C2C2A", // 9
];

export const brandTheme = createTheme({
  fontFamily: "Sora, sans-serif",
  colors: {
    blue,
    teal,
    purple,
    green,
    amber,
    red,
    gray,
  },
  primaryColor: "blue",
  primaryShade: { light: 5, dark: 4 },
  headings: {
    fontFamily: "Outift, sans-serif",
    fontWeight: "500",
    sizes: {
      h1: { fontSize: rem(28), lineHeight: "1.3" },
      h2: { fontSize: rem(22), lineHeight: "1.35" },
      h3: { fontSize: rem(18), lineHeight: "1.4" },
      h4: { fontSize: rem(16), lineHeight: "1.45" },
      h5: { fontSize: rem(14), lineHeight: "1.5" },
      h6: { fontSize: rem(13), lineHeight: "1.5" },
    },
  },
  other: {
    KURColors: {
      supermikro: "#1d9e75",
      sm_bg: "#e1f5ee",
      mikro: "#378add",
      m_bg: "#e6f1fb",
      kecil: "#7f77dd",
      k_bg: "#eeedfe",
    },
    HealthStatus: {
      healthy: "#639922",
      h_bg: green[0],
      warning: "#BA7517",
      w_bg: amber[0],
      not_healthy: "#A32D2D",
      nh_bg: red[0],
    },
  },
});
