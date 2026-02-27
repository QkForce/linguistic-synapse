import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "../ui/IconSymbol";

interface CategoryExportItemProps {
  title: string;
  totalSentences: number;
  onPress?: () => void;
}

export function CategoryExportItem({
  title,
  totalSentences,
  onPress,
}: CategoryExportItemProps) {
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
        <Animated.View
          style={[
            styles.innerGlass,
            {
              backgroundColor: colors.itemGlass,
              borderColor: colors.itemBorder,
              shadowColor: colors.title,
            },
            animatedStyle,
          ]}
        >
          {/* Ava */}
          <View
            style={[
              styles.ava,
              {
                borderColor: colors.itemBorder,
                backgroundColor: colors.itemInnerGlass,
              },
            ]}
          >
            <Text
              style={[styles.avaText, { color: colors.title }]}
              children={title.charAt(0)}
            />
          </View>
          {/* Content */}
          <View style={styles.content}>
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
          {/* Share Icon */}
          <View
            style={[
              styles.shareIconContainer,
              { backgroundColor: colors.itemInnerGlass },
            ]}
          >
            <IconSymbol name="share" size={16} color={colors.description} />
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%", // Layout енін ұстайды
    marginVertical: 6,
    borderRadius: 16,
  },
  innerGlass: {
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  ava: {
    width: 36,
    height: 36,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avaText: {
    fontSize: 18,
    fontWeight: "black",
  },
  content: {
    flex: 1,
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
  shareIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
