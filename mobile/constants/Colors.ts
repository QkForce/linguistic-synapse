export const palette = {
  cyan: "#00ffff",
  lightCyan: "rgba(0, 255, 255, 0.15)",
  cyanShadow: "rgba(0, 255, 255, 0.6)", // Жаңа қосылды (dark title shadow)

  green: "#4ADE80",
  softGreen: "rgba(21, 128, 61, 0.1)",
  softGreenLight: "rgba(21, 128, 61, 0.05)",
  deepGreen: "#15803D",
  lightGreen: "rgba(74, 222, 128, 0.15)",

  red: "#EF4444",
  lightRed: "rgba(239, 68, 68, 0.15)",
  deepRed: "#B91C1C",

  gray: "#6B7280",
  darkGray: "#1E293B",
  mediumGray: "#9CA3AF", // Жаңа (btnDisabledContent үшін)

  white: "#FFFFFF",
  whiteOpacity: "rgba(255, 255, 255, 0.5)",
  whiteLowOpacity: "rgba(255, 255, 255, 0.1)", // Жаңа (dark itemInnerGlass)
  whiteUltraLowOpacity: "rgba(255, 255, 255, 0.04)", // Жаңа (dark btnGlassBg)
  whiteBorderOpacity: "rgba(255, 255, 255, 0.15)", // Жаңа (dark btnGhostBorder)

  black: "#050607",
  blackOpacity: "rgba(0, 0, 0, 0.45)",
  blackLowOpacity: "rgba(0, 0, 0, 0.05)", // Жаңа (progressTrack light)
  blackUltraLowOpacity: "rgba(0, 0, 0, 0.03)", // Жаңа (btnGlassBg light)
  blackBorderOpacity: "rgba(0, 0, 0, 0.1)", // Жаңа (btnGhostBorder light)

  deepBlue: "#0064FF",
  lightBlueOpacity: "rgba(0, 100, 255, 0.2)", // Жаңа (itemBorder light)

  darkBlue: "#004466", // Жаңа (light title)
  darkBlueShadow: "rgba(0, 68, 102, 0.2)", // Жаңа (light title shadow)
  mediumBlue: "#006699", // Жаңа (light description)
  skyBlue: "#a0f0ff", // Жаңа (dark description)

  violet: "#6331DD",
  lightViolet: "rgba(99, 49, 221, 0.15)",
  deepViolet: "#4C21B3",
  glassViolet: "rgba(161, 62, 236, 0.3)", // Жаңа (itemGlass light)
  darkGlassViolet: "rgba(156, 57, 231, 0.15)", // Жаңа (itemGlass dark)

  amber: "#F59E0B",
  lightAmber: "rgba(245, 158, 11, 0.1)",
  brightAmber: "#FBBF24", // Жаңа (dark warning)
  brightAmberLight: "rgba(251, 191, 36, 0.15)", // Жаңа (dark warning background)

  // Арнайы фондар
  darkBg: "#1D1F22",
};

export const Colors = {
  light: {
    background: palette.white,
    text: palette.black,
    title: palette.darkBlue,
    titleShadow: palette.darkBlueShadow,
    description: palette.mediumBlue,

    itemBorder: palette.lightBlueOpacity,
    itemGlass: palette.glassViolet,
    itemInnerGlass: "rgba(255, 255, 255, 0.4)", // Бұл ерекше мән болғандықтан қалдырылды

    success: palette.deepGreen,
    successBackground: palette.softGreen,
    error: palette.deepRed,
    errorBackground: palette.lightRed,
    warning: palette.amber,
    warningBackground: palette.lightAmber,
    progressTrack: palette.blackLowOpacity,

    label: palette.blackOpacity,
    placeholder: palette.blackOpacity,

    btnPrimaryBorder: palette.deepBlue,
    btnPrimaryContent: palette.deepBlue,

    btnSuccessBorder: palette.deepGreen,
    btnSuccessContent: palette.deepGreen,

    btnDangerBorder: palette.deepRed,
    btnDangerContent: palette.deepRed,

    btnGhostBorder: "transparent",
    btnGhostContent: palette.blackOpacity,

    btnDisabledContent: palette.mediumGray,
    btnGlassBg: palette.blackUltraLowOpacity,
    btnOuterBorder: "rgba(0, 0, 0, 0.08)",

    awardIconBg: palette.violet,
    awardIconContent: palette.white,
  },
  dark: {
    background: palette.darkBg,
    text: palette.white,
    title: palette.cyan,
    titleShadow: palette.cyanShadow,
    description: palette.skyBlue,

    itemBorder: "rgba(0,255,255,0.3)",
    itemGlass: palette.darkGlassViolet,
    itemInnerGlass: palette.whiteLowOpacity,

    success: palette.green,
    successBackground: palette.softGreen,
    error: palette.red,
    errorBackground: palette.lightRed,
    warning: palette.brightAmber,
    warningBackground: palette.brightAmberLight,
    progressTrack: "rgba(255, 255, 255, 0.1)",

    label: palette.whiteOpacity,
    placeholder: palette.whiteOpacity,

    btnPrimaryBorder: palette.cyan,
    btnPrimaryContent: palette.cyan,

    btnSuccessBorder: palette.green,
    btnSuccessContent: palette.green,

    btnDangerBorder: palette.red,
    btnDangerContent: palette.red,

    btnGhostBorder: "transparent",
    btnGhostContent: palette.whiteOpacity,

    btnDisabledContent: palette.gray,
    btnGlassBg: palette.whiteUltraLowOpacity,
    btnOuterBorder: "rgba(255, 255, 255, 0.1)",

    awardIconBg: palette.violet,
    awardIconContent: palette.white,
  },
};
