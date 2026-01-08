import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeGradient } from "@/hooks/useThemeGradient";
import { useThemeTokens } from "@/hooks/useThemeTokens";

type Variant = "primary" | "success" | "danger" | "ghost";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  iconName?: IconSymbolName;
  iconPosition?: "left" | "right";
  iconSize?: number;
  iconStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export const Button = ({
  title,
  onPress,
  variant = "primary",
  iconName,
  iconPosition = "left",
  iconSize = 24,
  iconStyle,
  disabled = false,
  loading = false,
  height = 56,
  style,
}: ButtonProps) => {
  const colors = useThemeColor();
  const gradColors = useThemeGradient(variant);
  const tokens = useThemeTokens();
  const borderRadius = height * 0.3;
  const BORDER_COLORS = {
    primary: colors.btnPrimaryBorder,
    success: colors.btnSuccessBorder,
    danger: colors.btnDangerBorder,
    ghost: colors.btnGhostBorder,
  };
  const CONTENT_COLORS = {
    primary: colors.btnPrimaryContent,
    success: colors.btnSuccessContent,
    danger: colors.btnDangerContent,
    ghost: colors.btnGhostContent,
  };
  const borderColor = BORDER_COLORS[variant];
  const contentColor = disabled
    ? CONTENT_COLORS.ghost
    : CONTENT_COLORS[variant];
  const flatStyle = StyleSheet.flatten(style) as TextStyle;
  const fontSize = flatStyle?.fontSize || 16;
  const fontWeight = flatStyle?.fontWeight || "600";

  return (
    <View style={[styles.container, { height }, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.pressable,
          {
            borderRadius,
            opacity: pressed ? tokens.pressOpacity : 1,
            borderColor: colors.btnOuterBorder,
            borderWidth: tokens.btnOuterBorderWidth,
          },
        ]}
      >
        {/* LAYER 1: Glow - Low Opacity Gradient */}
        <LinearGradient
          colors={gradColors}
          style={[
            StyleSheet.absoluteFill,
            { borderRadius, opacity: tokens.btnGlowOpacity },
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

        {/* LAYER 2: Base Glass */}
        <View
          style={[
            styles.innerFrame,
            {
              borderRadius,
              borderColor: borderColor,
              backgroundColor: colors.btnGlassBg,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={contentColor} size="small" />
          ) : (
            <View
              style={[
                styles.content,
                {
                  flexDirection:
                    iconPosition === "left" ? "row" : "row-reverse",
                },
              ]}
            >
              {iconName && (
                <IconSymbol
                  name={iconName}
                  size={iconSize}
                  color={contentColor}
                  style={iconStyle}
                />
              )}
              <Text
                style={[
                  styles.text,
                  { color: contentColor, fontSize, fontWeight },
                ]}
              >
                {title}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  pressable: {
    flex: 1,
    overflow: "hidden",
    borderWidth: 1,
  },
  innerFrame: {
    flex: 1,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
