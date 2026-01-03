import { ColorValue } from "react-native";

const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#000",
    background: "#fff",
    backgroundSecondary: "rgba(242, 242, 242, 0.7)",
    backgroundTertiary: "rgba(0, 0, 0, 0.05)",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    title: "#004466",
    subtext: "#006699",
    border: "rgba(0,100,255,0.2)",
    glass: "rgba(255,255,255,0.7)",
    glassLesson: "rgba(161, 62, 236, 0.3)",
    success: "#4BB543",
  },
  dark: {
    text: "#fff",
    background: "#1D1F22",
    backgroundSecondary: "rgba(35, 36, 39, 0.7)",
    backgroundTertiary: "rgba(255, 255, 255, 0.1)",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    title: "#00ffff",
    subtext: "#a0f0ff",
    border: "rgba(0,255,255,0.3)",
    glass: "rgba(255,255,255,0.05)",
    glassLesson: "rgba(156, 57, 231, 0.15)",
    success: "#4BB543",
  },
};

type GradientScheme = readonly [ColorValue, ColorValue, ...ColorValue[]];

export const gradients = {
  cardBorder: ["#00ffff", "#0077ff"] as GradientScheme,
  purple: ["#a020f0", "#ff00ff"] as GradientScheme,
  gray100: ["#4A5568", "#2D3748"] as GradientScheme,
};
