import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Button } from "@/components/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onPressRetry: () => void;
  onPressClose: () => void;
};

export function ErrorState({
  title = "Error state!",
  description = "An error occurred.",
  onPressRetry,
  onPressClose,
}: ErrorStateProps) {
  const colors = useThemeColor();
  const translateX = useSharedValue(0);

  useEffect(() => {
    triggerShake();
  }, []);

  const triggerShake = () => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.errorBackground,
            shadowColor: colors.error,
            borderColor: colors.error,
          },
          animatedStyle,
        ]}
      >
        <IconSymbol name="warning-amber" color={colors.error} size={70} />
      </Animated.View>

      <Text style={[styles.title, { color: colors.error }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.error }]}>
        {description}
      </Text>

      <View style={styles.controls}>
        <Button
          title="retry"
          variant="danger"
          onPress={onPressRetry}
          style={styles.retryButton}
          height={65}
          iconName="replay"
          iconPosition="left"
          iconSize={28}
          iconStyle={styles.buttonIcon}
        />
        <Button
          title="go back"
          variant="ghost"
          onPress={onPressClose}
          style={styles.closeButton}
          height={65}
          iconName="arrow.backward"
          iconPosition="left"
          iconSize={28}
          iconStyle={styles.buttonIcon}
        />
      </View>
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
    width: 120,
    height: 120,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 70,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 95,
  },
  title: { marginTop: 80, fontSize: 28, textAlign: "center" },
  description: { marginTop: 20, fontSize: 16, textAlign: "center" },
  controls: {
    marginTop: 70,
  },
  retryButton: { marginTop: 20 },
  closeButton: { marginTop: 20 },
  buttonIcon: { marginRight: 6 },
});
