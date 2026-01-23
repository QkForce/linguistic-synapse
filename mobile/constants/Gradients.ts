import { palette } from "@/constants/Colors";
import { ColorValue } from "react-native";

export type Gradient = readonly [ColorValue, ColorValue, ...ColorValue[]];

export const Gradients = {
  light: {
    brand: ["#00ffff", "#0077ff"] as Gradient,
    primary: [palette.deepBlue, "transparent"] as Gradient,
    success: [palette.deepGreen, "transparent"] as Gradient,
    danger: [palette.deepRed, "transparent"] as Gradient,
    ghost: ["transparent", "transparent"] as Gradient,
    heatmapBg: [
      palette.lightCyan,
      "#b2ebf2",
      "#80deea",
      "#26c6da",
      palette.cyan,
    ] as const,
    heatmapText: [
      palette.gray,
      palette.black,
      palette.black,
      palette.white,
      palette.white,
    ] as const,
  },
  dark: {
    brand: ["#00ffff", "#0077ff"] as Gradient,
    primary: [palette.cyan, "transparent"] as Gradient,
    success: [palette.green, "transparent"] as Gradient,
    danger: [palette.red, "transparent"] as Gradient,
    ghost: ["transparent", "transparent"] as Gradient,
    heatmapBg: [
      "rgba(255,255,255,0.05)",
      "rgba(0,255,255,0.2)",
      "rgba(0,255,255,0.4)",
      "rgba(0,255,255,0.7)",
      palette.cyan,
    ] as const,
    heatmapText: [
      palette.whiteOpacity,
      palette.white,
      palette.white,
      palette.black,
      palette.black,
    ] as const,
  },
};

export type GradientName = keyof typeof Gradients.dark;
