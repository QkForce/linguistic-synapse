import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeGradient } from "@/hooks/useThemeGradient";

interface LessonItemProps {
  title: string;
  completed: boolean;
  onPress?: () => void;
}

export function LessonItem({ title, completed, onPress }: LessonItemProps) {
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
            {completed && (
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.itemInnerGlass },
                ]}
              >
                <IconSymbol name="check" size={24} color={colors.success} />
              </View>
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
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    flex: 1,
    marginRight: 12,
    fontSize: 18,
    fontWeight: "700",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  iconContainer: {
    borderRadius: 12,
    padding: 8,
  },
});
