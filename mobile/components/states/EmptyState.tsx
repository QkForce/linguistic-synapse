import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Button } from "@/components/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";

type EmptyStateProps = {
  title?: string;
  description?: string;
  onPressClose: () => void;
};

export function EmptyState({
  title = "Empty state!",
  description = "There is no data!",
  onPressClose,
}: EmptyStateProps) {
  const colors = useThemeColor();
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-15, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.iconContainer,
          {
            borderColor: colors.title,
            shadowColor: colors.title,
            // backgroundColor: colors.itemInnerGlass,
          },
        ]}
      >
        <IconSymbol name="database" color={colors.itemBorder} size={70} />
        <Animated.View style={[styles.seachContainer, animatedStyle]}>
          <IconSymbol name="search-off" color={colors.title} size={50} />
        </Animated.View>
      </View>

      <Text style={[styles.title, { color: colors.title }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.description }]}>
        {description}
      </Text>

      <Button
        title="exit"
        variant="primary"
        onPress={onPressClose}
        style={styles.closeButton}
        height={65}
        iconName="arrow.backward"
        iconPosition="left"
        iconSize={28}
        iconStyle={styles.buttonIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    // alignItems: "center",
  },
  iconContainer: {
    width: 140,
    height: 140,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "flex-end",
    // borderRadius: 70,
    // borderWidth: 0.4,
    // borderStyle: "dashed",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 95,
  },
  seachContainer: {
    position: "absolute",
    right: 20,
    bottom: 0,
  },
  title: { marginTop: 80, fontSize: 28, textAlign: "center" },
  description: { marginTop: 20, fontSize: 16, textAlign: "justify" },
  closeButton: { marginTop: 70 },
  buttonIcon: { marginRight: 6 },
});
