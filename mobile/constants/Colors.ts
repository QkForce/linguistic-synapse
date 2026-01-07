import { ColorValue } from "react-native";

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
  },
};

type GradientScheme = readonly [ColorValue, ColorValue, ...ColorValue[]];

export const gradients = {
  primaryGradient: ["#00ffff", "#0077ff"] as GradientScheme,
  actionPurple: ["#a020f0", "#ff00ff"] as GradientScheme,
  disabledGray: ["#4A5568", "#2D3748"] as GradientScheme,
};
