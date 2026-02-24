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
  style,
}: ButtonProps) => {
  const colors = useThemeColor();
  const gradColors = useThemeGradient(variant);
  const tokens = useThemeTokens();
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
  const flatStyle = (StyleSheet.flatten(style) || {}) as ViewStyle;
  const {
    margin,
    marginVertical,
    marginHorizontal,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  } = flatStyle;
  const width = flatStyle.width;
  const finalHeight = (flatStyle.height || 56) as number;
  const finalRadius =
    flatStyle.borderRadius !== undefined
      ? (flatStyle.borderRadius as number)
      : finalHeight * 0.3;
  const flex = flatStyle.flex;
  const padding = flatStyle.padding;
  const paddingVertical = flatStyle.paddingVertical;
  const paddingHorizontal = flatStyle.paddingHorizontal;
  const borderTopLeftRadius = flatStyle.borderTopLeftRadius;
  const borderTopRightRadius = flatStyle.borderTopRightRadius;
  const borderBottomLeftRadius = flatStyle.borderBottomLeftRadius;
  const borderBottomRightRadius = flatStyle.borderBottomRightRadius;
  const fontSize = (flatStyle as TextStyle).fontSize || 16;
  const fontWeight = (flatStyle as TextStyle).fontWeight || "600";

  return (
    <View
      style={[
        styles.container,
        {
          width,
          flex,
          height: finalHeight,
          margin,
          marginVertical,
          marginHorizontal,
          marginTop,
          marginBottom,
          marginLeft,
          marginRight,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.pressable,
          {
            borderRadius: finalRadius,
            borderTopLeftRadius,
            borderTopRightRadius,
            borderBottomLeftRadius,
            borderBottomRightRadius,
            opacity: pressed ? tokens.pressOpacity : 1,
            borderColor:
              variant === "ghost" ? "transparent" : colors.btnOuterBorder,
            borderWidth: tokens.btnOuterBorderWidth,
          },
        ]}
      >
        {/* LAYER 1: Glow - Low Opacity Gradient */}
        <LinearGradient
          colors={gradColors}
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: finalRadius,
              borderTopLeftRadius,
              borderTopRightRadius,
              borderBottomLeftRadius,
              borderBottomRightRadius,
              opacity: tokens.btnGlowOpacity,
            },
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

        {/* LAYER 2: Base Glass */}
        <View
          style={[
            styles.innerFrame,
            {
              borderRadius: finalRadius,
              borderTopLeftRadius,
              borderTopRightRadius,
              borderBottomLeftRadius,
              borderBottomRightRadius,
              borderColor: borderColor,
              backgroundColor:
                variant === "ghost" ? "transparent" : colors.btnGlassBg,
              padding: padding,
              paddingVertical: paddingVertical,
              paddingHorizontal: paddingHorizontal,
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
