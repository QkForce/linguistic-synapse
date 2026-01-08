import { useColorScheme } from "react-native";

import { Colors } from "@/constants/Colors";

type Theme = "light" | "dark";
type ColorName = keyof typeof Colors.light;

export function useThemeColor(): Record<ColorName, string>;
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName
): string;
export function useThemeColor(
  props?: { light?: string; dark?: string },
  colorName?: ColorName
) {
  const theme = (useColorScheme() ?? "light") as Theme;
  if (colorName) {
    // Старый стиль: вернуть конкретный цвет
    const colorFromTheme = Colors[theme][colorName];
    return props?.[theme] ?? colorFromTheme;
  }

  // Новый стиль: вернуть все цвета
  return Colors[theme];
}

export function useCurrentTheme() {
  const theme = useColorScheme() ?? "light";
  return theme;
}
