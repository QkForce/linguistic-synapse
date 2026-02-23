import { useAnimatedStyle, withTiming } from "react-native-reanimated";

export const useExerciseAnimations = (
  isReady: boolean,
  isKeyboardOpen: boolean,
  insets: { top: number; bottom: number },
) => {
  const animatedDockedCapsuleStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isReady ? 1 : 0.1, { duration: 500 }),
    marginHorizontal: withTiming(isKeyboardOpen ? 0 : 16, { duration: 200 }),
    marginBottom: withTiming(isKeyboardOpen ? insets.top : insets.bottom, {
      duration: 200,
    }),
    borderBottomLeftRadius: withTiming(isKeyboardOpen ? 0 : 40, {
      duration: 200,
    }),
    borderBottomRightRadius: withTiming(isKeyboardOpen ? 0 : 40, {
      duration: 200,
    }),
  }));
  const animatedNativeTextStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isReady ? 1 : 0, { duration: 500 }),
  }));

  return { animatedDockedCapsuleStyle, animatedNativeTextStyle };
};
