import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { gradients } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

interface LessonItemProps {
  title: string;
  completed: boolean;
  onPress?: () => void;
}

export function LessonItem({ title, completed, onPress }: LessonItemProps) {
  const colors = useThemeColor();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.cardContainer}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.97))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.animatedWrapper, animatedStyle]}>
          {/* Neon border */}
          <LinearGradient
            colors={gradients.cardBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.borderGlow}
          />

          {/* Glass inner background */}
          <View
            style={[
              styles.innerGlass,
              {
                borderColor: colors.border,
                backgroundColor: colors.glassLesson,
              },
            ]}
          >
            <Text style={[styles.title, { color: colors.title }]}>{title}</Text>
            {completed && (
              <IconSymbol name="check" size={24} color={colors.success} />
            )}
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    marginVertical: 6,
    borderRadius: 8,
  },
  animatedWrapper: {
    flex: 1,
  },
  borderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    opacity: 0.3,
  },
  innerGlass: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(0,255,255,0.3)",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#00ffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00ffff",
    textShadowColor: "rgba(0,255,255,0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  description: {
    color: "#a0f0ff",
    marginTop: 4,
    fontSize: 14,
  },
  progressLabel: {
    alignSelf: "flex-end",
    color: "#a0f0ff",
    marginTop: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  progressContainer: {
    height: 6,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 10,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});
