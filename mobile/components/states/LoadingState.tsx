import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";

type LoadingStateProps = {
  title?: string;
  description?: string;
};

export function LoadingState({
  title = "Loading...",
  description = "Data is being retrieved.",
}: LoadingStateProps) {
  const colors = useThemeColor();
  const opacity = useSharedValue(0.2);
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
    scale.value = withRepeat(withTiming(1.1, { duration: 1500 }), -1, true);
    progress.value = withRepeat(withTiming(4, { duration: 1500 }), -1, false);
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const dot1AnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0, 1], "clamp");
    return {
      opacity: opacity,
    };
  });
  const dot2AnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [1, 2], [0, 1], "clamp");
    return {
      opacity: opacity,
    };
  });
  const dot3AnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [2, 3], [0, 1], "clamp");
    return {
      opacity: opacity,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
        <IconSymbol name="hourglass-bottom" color={colors.title} size={50} />
      </Animated.View>

      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.title,
            { color: colors.title, shadowColor: colors.title },
          ]}
        >
          {title}
        </Text>
        <Animated.Text
          style={[styles.dot, { color: colors.title }, dot1AnimatedStyle]}
          children="."
        />
        <Animated.Text
          style={[styles.dot, { color: colors.title }, dot2AnimatedStyle]}
          children="."
        />
        <Animated.Text
          style={[styles.dot, { color: colors.title }, dot3AnimatedStyle]}
          children="."
        />
      </View>

      <Text style={[styles.description, { color: colors.description }]}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 50,
  },
  dot: {
    fontSize: 28,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 50,
  },
  description: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
