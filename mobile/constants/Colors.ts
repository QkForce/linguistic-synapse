export const palette = {
  cyan: "#00ffff",
  lightCyan: "rgba(0, 255, 255, 0.15)",
  green: "#4ADE80",
  lightGreen: "rgba(74, 222, 128, 0.15)",
  red: "#EF4444",
  lightRed: "rgba(239, 68, 68, 0.15)",
  gray: "#6B7280",
  darkGray: "#1E293B",
  white: "#FFFFFF",
  whiteOpacity: "rgba(255, 255, 255, 0.5)",
  black: "#050607",
  blackOpacity: "rgba(0, 0, 0, 0.45)",
  deepBlue: "#0064FF",
  deepGreen: "#15803D",
  deepRed: "#B91C1C",
};

export const Colors = {
  light: {
    background: "#fff",
    text: "#000",
    title: "#004466",
    titleShadow: "rgba(0, 68, 102, 0.2)",
    description: "#006699",

    itemBorder: "rgba(0, 100, 255, 0.2)",
    itemGlass: "rgba(161, 62, 236, 0.3)",
    itemInnerGlass: "rgba(255, 255, 255, 0.4)",

    success: "#15803D",
    progressTrack: "rgba(0, 0, 0, 0.05)",

    label: palette.blackOpacity,
    placeholder: palette.blackOpacity,

    btnPrimaryBorder: palette.deepBlue,
    btnPrimaryContent: palette.deepBlue,

    btnSuccessBorder: palette.deepGreen,
    btnSuccessContent: palette.deepGreen,

    btnDangerBorder: palette.deepRed,
    btnDangerContent: palette.deepRed,

    btnGhostBorder: "rgba(0, 0, 0, 0.1)",
    btnGhostContent: palette.blackOpacity,

    btnDisabledContent: "#9CA3AF",
    btnGlassBg: "rgba(0, 0, 0, 0.03)",
    btnOuterBorder: "rgba(0, 0, 0, 0.08)",
  },
  dark: {
    background: "#1D1F22",
    text: "#fff",
    title: "#00ffff",
    titleShadow: "rgba(0, 255, 255, 0.6)",
    description: "#a0f0ff",

    itemBorder: "rgba(0,255,255,0.3)",
    itemGlass: "rgba(156, 57, 231, 0.15)",
    itemInnerGlass: "rgba(255, 255, 255, 0.1)",

    success: "#4ADE80",
    progressTrack: "rgba(255, 255, 255, 0.1)",

    label: palette.whiteOpacity,
    placeholder: palette.whiteOpacity,

    btnPrimaryBorder: palette.cyan,
    btnPrimaryContent: palette.cyan,

    btnSuccessBorder: palette.green,
    btnSuccessContent: palette.green,

    btnDangerBorder: palette.red,
    btnDangerContent: palette.red,

    btnGhostBorder: "rgba(255, 255, 255, 0.15)",
    btnGhostContent: palette.whiteOpacity,

    btnDisabledContent: palette.gray,
    btnGlassBg: "rgba(255, 255, 255, 0.04)",
    btnOuterBorder: "rgba(255, 255, 255, 0.1)",
  },
};
