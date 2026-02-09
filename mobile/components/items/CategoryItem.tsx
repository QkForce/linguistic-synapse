import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeGradient } from "@/hooks/useThemeGradient";
import { IconSymbol } from "../ui/IconSymbol";

interface CategoryItemProps {
  title: string;
  totalSentences: number;
  onPress?: () => void;
}

export function CategoryItem({
  title,
  totalSentences,
  onPress,
}: CategoryItemProps) {
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
            <View style={[styles.ava, { borderColor: colors.itemBorder }]}>
              <Text
                style={[styles.avaText, { color: colors.title }]}
                children={title.charAt(0)}
              />
            </View>
            <View>
              <Text
                style={[styles.title, { color: colors.text }]}
                children={title}
              />
              <View style={styles.totalSentencesRow}>
                <IconSymbol name="layers" size={10} color={colors.text} />
                <Text
                  style={[styles.totalSentences, { color: colors.text }]}
                  children={`${totalSentences} сөйлем`}
                />
              </View>
            </View>
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
    flexDirection: "row",
    gap: 16,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  ava: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avaText: {
    fontSize: 18,
    fontWeight: "black",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
  },
  totalSentencesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalSentences: {
    marginTop: 2,
    marginLeft: 2,
    fontSize: 10,
  },
});
