import { Gradient, GradientName, Gradients } from "@/constants/Gradients";
import { useColorScheme } from "react-native";

export function useThemeGradient(): typeof Gradients.light;
export function useThemeGradient(name: GradientName): Gradient;
export function useThemeGradient(name?: GradientName) {
  const theme = useColorScheme() ?? "light";

  if (name) {
    return Gradients[theme as keyof typeof Gradients][name];
  }

  return Gradients[theme as keyof typeof Gradients];
}
