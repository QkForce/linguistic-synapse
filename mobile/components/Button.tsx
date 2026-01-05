import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ColorValue,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { gradients } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

type ButtonProps = TouchableOpacityProps & {
  title?: string;
  iconName?: IconSymbolName;
  iconSize?: number;
  iconColor: ColorValue;
  gradient?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  buttonStyle?: ViewStyle;
  buttonGradientStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: TextStyle;
  disabled?: Boolean;
  children?: React.ReactNode;
};

export default function Button({
  onPress,
  disabled = false,
  title,
  iconName,
  iconSize = 20,
  iconColor,
  gradient = gradients.disabledGray,
  buttonStyle,
  buttonGradientStyle,
  textStyle,
  iconStyle,
  children,
  ...rest
}: ButtonProps) {
  const colors = useThemeColor();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { shadowColor: colors.title }, buttonStyle]}
      disabled={disabled}
      {...rest}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, buttonGradientStyle]}
      >
        {iconName && (
          <IconSymbol
            name={iconName}
            size={iconSize}
            color={iconColor}
            style={[styles.icon, iconStyle]}
          />
        )}
        {title && <Text style={[styles.buttonText, textStyle]}>{title}</Text>}
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    overflow: "hidden",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
  },
});
