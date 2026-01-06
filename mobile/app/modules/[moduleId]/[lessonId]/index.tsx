import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Flashcard } from "@/components/Flashcard";
import { ProgressBar } from "@/components/ProgressBar";
import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { gradients } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function LessonScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const { lessonId } = useLocalSearchParams();
  const [state, setState] = useState({
    title: `Lesson ${lessonId}`,
    currentSentenceIndex: 3,
    totalSentences: 10,
    time: "01:05",
  });
  const [text, setText] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [assessment, setAssessment] = useState<boolean | null>(null);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      title: `Lesson ${lessonId}`,
    }));
  }, [lessonId]);

  const handleMainAction = () => {
    if (!isFlipped) {
      if (text.trim().length > 0) setIsFlipped(true);
    } else {
      if (assessment !== null) {
        setIsFlipped(false);
        setAssessment(null);
        setText("");
        // setState(prev => ({ ...prev, currentSentenceIndex: prev.currentSentenceIndex + 1 }));
      }
    }
  };

  const getButtonState = () => {
    if (!isFlipped) {
      const active = text.trim().length > 0;
      return {
        label: "CHECK",
        disabled: !active,
        color: active ? colors.buttonPrimaryText : colors.buttonDisabledText,
        bg: active ? colors.buttonPrimaryBg : colors.itemGlass,
        iconName: "replay",
      };
    } else {
      const active = assessment !== null;
      return {
        label: "CONTINUE",
        disabled: !active,
        color: active ? colors.buttonSuccessText : colors.buttonDisabledText,
        bg: active ? colors.buttonSuccessBg : colors.itemGlass,
        iconName: "arrow.forward",
      };
    }
  };

  const btn = getButtonState();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      <View style={styles.topBar}>
        <Pressable
          style={[
            styles.topBarButton,
            {
              backgroundColor: colors.itemGlass,
              borderColor: colors.itemBorder,
              shadowColor: colors.title,
            },
          ]}
        >
          <IconSymbol name="close" size={18} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>
          {state.title}
        </Text>
        <View
          style={[
            styles.topBarButton,
            {
              backgroundColor: colors.itemGlass,
              borderColor: colors.itemBorder,
              shadowColor: colors.title,
            },
          ]}
        >
          <Text
            style={[styles.timeText, { color: colors.text }]}
          >{`${state.time}`}</Text>
        </View>
      </View>
      <ProgressBar
        current={state.currentSentenceIndex}
        total={state.totalSentences}
        indicatorGradient={gradients.primaryGradient}
        style={[
          styles.progressBar,
          { shadowColor: colors.title, backgroundColor: colors.progressTrack },
        ]}
        indicatorStyle={[
          styles.progressBarIndicator,
          { shadowColor: colors.title },
        ]}
      />
      <View style={styles.innerContainer}>
        <Flashcard
          native="Привет"
          target="Hello"
          style={styles.flashcard}
          flipped={isFlipped}
          text={text}
          setText={setText}
          isAssessed={assessment}
          onAssess={setAssessment}
        />
        <View
          style={[
            styles.progressLabelContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.progressLabel, { color: colors.title }]}>
            {`${state.currentSentenceIndex}/${state.totalSentences}`}
          </Text>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <Pressable
          onPress={handleMainAction}
          disabled={btn.disabled}
          style={[
            styles.nextButton,
            { backgroundColor: btn.bg, borderColor: btn.color },
          ]}
        >
          <Text style={[styles.nextButtonText, { color: btn.color }]}>
            {btn.label}
          </Text>
          <IconSymbol
            name={btn.iconName as IconSymbolName}
            size={24}
            color={btn.color}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    // shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 10,
  },
  progressBar: {
    height: 0.8,
    overflow: "visible",
  },
  progressBarIndicator: {
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
    shadowOpacity: 0.9,
    shadowRadius: 5,
    borderRadius: 1,
  },
  flashcard: {
    minHeight: 380,
  },
  progressLabelContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    width: "auto",
    alignSelf: "center",
  },
  progressLabel: {
    fontSize: 16,
    textAlign: "center",
  },
  rowContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  nextButton: {
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    flexDirection: "row",
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 7,
  },
});
