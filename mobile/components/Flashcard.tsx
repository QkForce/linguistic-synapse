import { useEffect } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";

type FlashcardProps = {
  native: string;
  target: string;
  flipped: boolean;
  style?: StyleProp<ViewStyle>;
  text: string;
  setText: (val: string) => void;
  isAssessed: boolean | null;
  onAssess: (value: boolean) => void;
};

export function Flashcard({
  native,
  target,
  flipped,
  style,
  text,
  setText,
  isAssessed,
  onAssess,
}: FlashcardProps) {
  const spin = useSharedValue(0);
  const colors = useThemeColor();

  useEffect(() => {
    spin.value = withTiming(flipped ? 1 : 0, { duration: 600 });
  }, [flipped]);

  const animatedStyle = (isBack: boolean) =>
    useAnimatedStyle(() => {
      const rotateValue = interpolate(
        spin.value,
        [0, 1],
        isBack ? [180, 360] : [0, 180]
      );
      return {
        transform: [{ perspective: 1000 }, { rotateY: `${rotateValue}deg` }],
      };
    });

  const cardBaseStyle = {
    backgroundColor: colors.cardBg,
    borderColor: colors.itemBorder,
    shadowColor: colors.titleShadow,
  };

  return (
    <View style={[styles.cardContainer, style]}>
      <Animated.View
        pointerEvents={flipped ? "none" : "auto"}
        style={[
          styles.card,
          cardBaseStyle,
          animatedStyle(false),
          styles.absoluteCard,
        ]}
      >
        <View style={styles.innerContent}>
          <Text style={[styles.label, { color: colors.description }]}>
            Native (RU)
          </Text>
          <View style={styles.textContainer}>
            <Text style={[styles.text, { color: colors.text }]}>{native}</Text>
          </View>
          <TextInput
            value={text}
            onChangeText={setText}
            style={[
              styles.input,
              {
                borderColor: colors.itemBorder,
                backgroundColor: colors.inputBg,
                color: colors.text,
              },
            ]}
            multiline={true}
            placeholder="Write the translation..."
            placeholderTextColor={colors.inputPlaceholder}
            editable={!flipped}
          />
        </View>
      </Animated.View>

      <Animated.View
        pointerEvents={flipped ? "auto" : "none"}
        style={[
          styles.card,
          cardBaseStyle,
          animatedStyle(true),
          { borderStyle: "dashed" },
        ]}
      >
        <View style={styles.innerContent}>
          <Text style={[styles.label, { color: colors.success }]}>
            Correct answer (EN)
          </Text>
          <View style={styles.textContainer}>
            <Text
              style={[styles.text, styles.targetText, { color: colors.text }]}
            >
              {target}
            </Text>
          </View>

          <View style={styles.assessmentContainer}>
            <Pressable
              onPress={() => onAssess(false)}
              style={[
                styles.assessBtn,
                {
                  borderColor:
                    isAssessed === false ? colors.error : colors.itemBorder,
                  backgroundColor:
                    isAssessed === false
                      ? colors.buttonErrorBg
                      : colors.buttonInactiveBg,
                },
              ]}
            >
              <IconSymbol
                name="close"
                size={16}
                color={isAssessed === false ? colors.error : colors.text}
              />
              <Text
                style={[
                  styles.assessText,
                  { color: isAssessed === false ? colors.error : colors.text },
                ]}
              >
                UNSURE
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onAssess(true)}
              style={[
                styles.assessBtn,
                {
                  borderColor:
                    isAssessed === true ? colors.success : colors.itemBorder,
                  backgroundColor:
                    isAssessed === true
                      ? colors.buttonSuccessBg
                      : colors.buttonInactiveBg,
                },
              ]}
            >
              <IconSymbol
                name="check"
                size={16}
                color={isAssessed === true ? colors.success : colors.text}
              />
              <Text
                style={[
                  styles.assessText,
                  { color: isAssessed === true ? colors.success : colors.text },
                ]}
              >
                SURE
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    height: 340,
    marginVertical: 15,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    borderWidth: 1,
    backfaceVisibility: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  absoluteCard: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  innerContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    height: 110,
    textAlignVertical: "top",
    marginTop: 10,
  },
  text: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "600",
    marginVertical: 10,
  },
  targetText: {
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textShadowColor: "rgba(34, 211, 238, 0.4)",
  },
  assessmentContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    width: "100%",
  },
  assessBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  assessText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
