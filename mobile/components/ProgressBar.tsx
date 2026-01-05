import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { gradients } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ProgressBarProps {
  current: number;
  total: number;
  style?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  indicatorGradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
}

export function ProgressBar({
  current,
  total,
  style,
  indicatorStyle = {},
  indicatorGradient = gradients.primaryGradient,
}: ProgressBarProps) {
  const progress = useSharedValue(0);
  const colors = useThemeColor();

  useEffect(() => {
    const percent = total > 0 ? (current / total) * 100 : 0;
    progress.value = withSpring(percent, { damping: 15 });
  }, [current, total]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.indicator,
          indicatorStyle,
          { shadowColor: colors.title },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={indicatorGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.innerIndicator}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 6,
    width: "100%",
    borderRadius: 3,
    overflow: "hidden",
  },
  indicator: {
    height: "100%",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  innerIndicator: {
    flex: 1,
  },
});
