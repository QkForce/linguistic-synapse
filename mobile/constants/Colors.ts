import { ColorValue } from "react-native";

const palette = {
  cyan: "#00ffff",
  lightCyan: "rgba(0, 255, 255, 0.15)",
  green: "#4ADE80",
  lightGreen: "rgba(74, 222, 128, 0.15)",
  red: "#EF4444",
  lightRed: "rgba(239, 68, 68, 0.15)",
  gray: "#6B7280",
  darkGray: "#1E293B",
  glass: "rgba(255, 255, 255, 0.03)",
  transparent: "transparent",
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
    warning: "#EAB308",
    error: "#EF4444",
    inputPlaceholder: "#9CA3AF",
    progressTrack: "rgba(0, 0, 0, 0.05)",
    cardBg: "#FFFFFF",
    inputBg: "rgba(0, 0, 0, 0.05)",

    buttonPrimaryBg: "rgba(0, 100, 255, 0.1)",
    buttonPrimaryText: "#0064FF",
    buttonSuccessBg: "rgba(21, 128, 61, 0.1)",
    buttonSuccessText: "#15803D",
    buttonErrorBg: "rgba(239, 68, 68, 0.1)",
    buttonErrorText: "#EF4444",
    buttonDisabledText: "#9CA3AF",
    buttonInactiveBg: palette.transparent,
  },
  dark: {
    background: "#1D1F22",
    text: "#fff",
    title: "#00ffff",
    titleShadow: "rgba(0, 255, 255, 0.6)",
    description: "#a0f0ff",

    itemBorder: "rgba(0,255,255,0.3)",
    itemGlass: "rgba(255, 255, 255, 0.03)",
    itemInnerGlass: "rgba(255, 255, 255, 0.1)",

    success: "#4ADE80",
    warning: "#FACC15",
    error: "#EF4444",
    inputPlaceholder: "#6B7280",
    progressTrack: "rgba(255, 255, 255, 0.1)",
    cardBg: "#1E293B",
    inputBg: "rgba(0, 0, 0, 0.25)",

    buttonPrimaryBg: palette.lightCyan,
    buttonPrimaryText: palette.cyan,
    buttonSuccessBg: palette.lightGreen,
    buttonSuccessText: palette.green,
    buttonErrorBg: palette.lightRed,
    buttonErrorText: palette.red,
    buttonDisabledText: palette.gray,
    buttonInactiveBg: palette.transparent,
  },
};

type GradientScheme = readonly [ColorValue, ColorValue, ...ColorValue[]];

export const gradients = {
  primaryGradient: ["#2563EB", "#22D3EE"] as GradientScheme,
  actionPurple: ["#a020f0", "#ff00ff"] as GradientScheme,
  disabledGray: ["#4A5568", "#2D3748"] as GradientScheme,
};
