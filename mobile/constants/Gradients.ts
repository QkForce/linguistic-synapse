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
  },
  dark: {
    brand: ["#00ffff", "#0077ff"] as Gradient,
    primary: [palette.cyan, "transparent"] as Gradient,
    success: [palette.green, "transparent"] as Gradient,
    danger: [palette.red, "transparent"] as Gradient,
    ghost: ["transparent", "transparent"] as Gradient,
  },
};

export type GradientName = keyof typeof Gradients.dark;
