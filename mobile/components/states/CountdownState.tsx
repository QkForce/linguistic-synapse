import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/useThemeColor";

type CountdownStateProps = {
  countdown: number;
};

export function CountdownState({ countdown }: CountdownStateProps) {
  const colors = useThemeColor();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(withTiming(3, { duration: 1000 }), -1, false);
    opacity.value = withRepeat(withTiming(0, { duration: 1000 }), -1, false);
  }, []);

  const pingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <Animated.View
        style={[styles.ping, { borderColor: colors.label }, pingStyle]}
      />
      <Animated.Text
        key={countdown}
        entering={ZoomIn.duration(300)}
        exiting={FadeOut.duration(200)}
        style={[styles.countdownText, { color: colors.title }]}
      >
        {countdown}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ping: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1.5,
  },
  countdownText: {
    fontSize: 96,
  },
});
