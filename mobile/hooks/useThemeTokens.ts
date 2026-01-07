import { ThemeTokens, Tokens } from "@/constants/Tokens";
import { useColorScheme } from "react-native";

export function useThemeTokens(): ThemeTokens {
  const theme = useColorScheme() ?? "light";
  return Tokens[theme as keyof typeof Tokens];
}
