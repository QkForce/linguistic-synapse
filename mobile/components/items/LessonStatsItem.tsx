import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SentenceLog } from "@/types/stat";
import { formatMsToTime } from "@/utils/time";

export const LessonStatsItem = ({
  item,
  nativeLang,
  targetLang,
  index,
}: {
  item: SentenceLog;
  nativeLang: string;
  targetLang: string;
  index: number;
}) => {
  const colors = useThemeColor();
  const scale = useSharedValue(1);
  const offset = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textSlideFadeStyle = (isBack: boolean) =>
    useAnimatedStyle(() => {
      const translateY = interpolate(
        offset.value,
        [0, 1],
        isBack ? [30, 0] : [0, -30]
      );
      const opacity = interpolate(
        offset.value,
        [0, 0.9, 1],
        isBack ? [0, 0.2, 1] : [1, 0.2, 0]
      );
      return {
        transform: [{ translateY }],
        opacity,
      };
    });

  const onPressCard = () => {
    setIsFlipped(!isFlipped);
    offset.value = withSpring(isFlipped ? 0 : 1, {
      damping: 30,
      stiffness: 180,
    });
  };

  return (
    <View style={{ width: "100%" }}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.97))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPressCard}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.itemGlass,
              borderColor: colors.itemBorder,
            },
            animatedStyle,
          ]}
        >
          <View style={styles.topBar}>
            <Text style={[styles.indexLabel, { color: colors.label }]}>
              {`Сөйлем #${index + 1}`}
            </Text>
            <View
              style={[
                styles.accuracyContainer,
                { backgroundColor: colors.itemInnerGlass },
              ]}
            >
              <Text style={[styles.accuracyText, { color: colors.warning }]}>
                {`${item.accuracy * 100}%`}
              </Text>
            </View>
          </View>

          <View style={styles.sourceContainer}>
            <Animated.View
              style={[styles.sourceInnerContainer, textSlideFadeStyle(false)]}
            >
              <View
                style={[
                  styles.langCodeContainer,
                  { backgroundColor: colors.itemInnerGlass },
                ]}
              >
                <Text style={[styles.langCodeText, { color: colors.label }]}>
                  {targetLang}
                </Text>
              </View>
              <Text
                style={[styles.sourceText, { color: colors.text }]}
                ellipsizeMode="tail"
              >
                {item.target_text}
              </Text>
            </Animated.View>

            <Animated.View
              style={[styles.sourceInnerContainer, textSlideFadeStyle(true)]}
            >
              <View
                style={[
                  styles.langCodeContainer,
                  { backgroundColor: colors.itemInnerGlass },
                ]}
              >
                <Text style={[styles.langCodeText, { color: colors.label }]}>
                  {nativeLang}
                </Text>
              </View>
              <Text
                style={[styles.sourceText, { color: colors.text }]}
                ellipsizeMode="tail"
              >
                {item.native_text}
              </Text>
            </Animated.View>
          </View>

          <Text style={[styles.responseLabel, { color: colors.label }]}>
            Берілген жауап:
          </Text>
          <Text
            style={[
              styles.responseText,
              { color: item.accuracy == 0 ? colors.label : colors.success },
            ]}
          >
            {item.response_text}
          </Text>

          <View
            style={[styles.bottomBar, { borderTopColor: colors.itemBorder }]}
          >
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Text style={[styles.bottomText, { color: colors.label }]}>
                <IconSymbol name="access-time" size={10} color={colors.label} />
                {` ${formatMsToTime(item.response_time_ms)}`}
              </Text>
              <Text style={[[styles.bottomText, { color: colors.label }]]}>
                <IconSymbol name="bolt" size={10} color={colors.label} />
                {` ${item.confidence * 100}% сенімді`}
              </Text>
            </View>
            <View
              style={[styles.langDir, { backgroundColor: colors.itemGlass }]}
            >
              <Text style={[styles.langDirText, { color: colors.label }]}>
                {`${nativeLang} › ${targetLang}`}
              </Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  indexLabel: {
    width: 100,
    fontSize: 9,
    textTransform: "uppercase",
  },
  accuracyContainer: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  accuracyText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  sourceContainer: {
    width: "100%",
    height: 44,
    justifyContent: "center",
  },
  sourceInnerContainer: {
    width: "100%",
    flexDirection: "row",
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  langCodeContainer: {
    width: 30,
    marginRight: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  langCodeText: {
    fontSize: 8,
    textAlign: "center",
    textAlignVertical: "center",
    textTransform: "uppercase",
  },
  sourceText: {
    flex: 1,
    fontSize: 14,
  },
  responseLabel: {
    width: "100%",
    fontSize: 8,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 4,
  },
  responseText: {
    width: "100%",
    fontSize: 12,
    marginBottom: 8,
  },
  bottomBar: {
    width: "100%",
    borderTopWidth: 0.3,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
  },
  bottomText: {
    fontSize: 10,
    textAlignVertical: "center",
  },
  langDir: {
    width: 40,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  langDirText: {
    fontSize: 8,
    textAlignVertical: "center",
    textTransform: "uppercase",
  },
});
