import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ProgressBar } from "@/components/ProgressBar";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeGradient } from "@/hooks/useThemeGradient";

interface ModuleItemProps {
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  onPress?: () => void;
}

export function ModuleItem({
  title,
  description,
  totalLessons,
  completedLessons,
  onPress,
}: ModuleItemProps) {
  const colors = useThemeColor();
  const gradColors = useThemeGradient("brand");
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
            colors={gradColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.borderGlow}
          />

          {/* Glass inner background */}
          <View
            style={[
              styles.innerGlass,
              {
                backgroundColor: colors.itemGlass,
                borderColor: colors.itemBorder,
                shadowColor: colors.title,
              },
            ]}
          >
            <Text
              style={[
                styles.title,
                { color: colors.title, textShadowColor: colors.titleShadow },
              ]}
            >
              {title}
            </Text>
            <Text style={[styles.description, { color: colors.description }]}>
              {description}
            </Text>
            <Text
              style={[styles.progressLabel, { color: colors.description }]}
            >{`${completedLessons}/${totalLessons}`}</Text>

            <ProgressBar
              current={completedLessons}
              total={totalLessons}
              style={[
                styles.progressContainer,
                { backgroundColor: colors.progressTrack },
              ]}
              indicatorStyle={styles.progressIndicator}
              indicatorGradient={gradColors}
            />
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%", // Layout енін ұстайды
    marginVertical: 8,
    borderRadius: 16,
  },
  animatedWrapper: {
    flex: 1,
  },
  borderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    opacity: 0.3,
  },
  innerGlass: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  description: {
    marginTop: 4,
    fontSize: 14,
  },
  progressLabel: {
    alignSelf: "flex-end",
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
  progressIndicator: {
    height: "100%",
    borderRadius: 4,
  },
});
