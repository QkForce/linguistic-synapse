import {
  ColorValue,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";

type SectionHeaderProps = {
  iconName: IconSymbolName;
  iconColor?: ColorValue;
  text: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function SectionHeader({
  iconName,
  iconColor,
  text,
  style,
  textStyle,
}: SectionHeaderProps) {
  const colors = useThemeColor();
  const flatTextStyle = StyleSheet.flatten(textStyle) || {};

  return (
    <View style={[styles.container, style]}>
      <IconSymbol
        name={iconName}
        color={iconColor || colors.title}
        size={(flatTextStyle.fontSize || 16) + 3}
      />
      <Text
        style={[styles.text, { color: colors.label }, textStyle]}
        children={text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
