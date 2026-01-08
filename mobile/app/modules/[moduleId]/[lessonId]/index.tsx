import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeGradient } from "@/hooks/useThemeGradient";

interface ExerciseState {
  lessonTitle: string;
  currentNativeSentence: string;
  currentSentenceIndex: number;
  totalSentences: number;
  timeString: string;
  translation: string;
  confidence: "sure" | "unsure" | null;
}

export default function LessonScreen() {
  const insets = useSafeAreaInsets();
  const gradColors = useThemeGradient("brand");
  const colors = useThemeColor();
  const [state, setState] = useState<ExerciseState>({
    lessonTitle: "Lesson 1: Begining",
    currentNativeSentence: "Мен бүгін жұмысқа барамын!",
    currentSentenceIndex: 3,
    totalSentences: 35,
    timeString: "00:05",
    translation: "",
    confidence: null,
  });

  const toggleConfidence = (value: "sure" | "unsure") => {
    setState((prev) => ({
      ...prev,
      confidence: value,
    }));
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 16, backgroundColor: colors.background },
      ]}
    >
      <ProgressBar
        current={state.currentSentenceIndex}
        total={state.totalSentences}
        indicatorGradient={gradColors}
        style={styles.progressBar}
      />

      <View style={styles.header}>
        <Pressable onPress={() => {}} style={styles.closeButton}>
          <IconSymbol
            color={colors.title}
            name="close"
            style={styles.closeIcon}
          />
        </Pressable>
        <View style={styles.timeContainer}>
          <IconSymbol
            name="access-time"
            color={colors.title}
            style={styles.timeIcon}
            size={18}
          />
          <Text style={[styles.timeText, { color: colors.text }]}>
            {state.timeString}
          </Text>
        </View>
        <Text
          style={[styles.progressTextIndicator, { color: colors.label }]}
        >{`${state.currentSentenceIndex} / ${state.totalSentences}`}</Text>
      </View>
      <Text style={[styles.title, { color: colors.title }]}>
        {state.lessonTitle}
      </Text>

      <View
        style={[
          styles.cardContainer,
          { borderColor: colors.itemBorder, backgroundColor: colors.itemGlass },
        ]}
      >
        <Text style={[styles.nativeText, { color: colors.title }]}>
          {state.currentNativeSentence}
        </Text>
        <Pressable
          style={[
            styles.voiceButton,
            {
              backgroundColor: colors.itemInnerGlass,
              borderColor: colors.itemBorder,
            },
          ]}
        >
          <IconSymbol
            name="volume-up"
            color={colors.title}
            style={styles.volumeIcon}
            size={30}
          />
        </Pressable>
      </View>

      <Text style={[styles.inputLabel, { color: colors.label }]}>
        Enter the translation:
      </Text>
      <TextInput
        onChangeText={(text) =>
          setState((prev) => ({ ...prev, translation: text }))
        }
        value={state.translation}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.itemBorder,
            backgroundColor: colors.itemInnerGlass,
          },
        ]}
        multiline={true}
        placeholder="Type translationhere…"
        placeholderTextColor={colors.placeholder}
      />

      <View style={styles.assessmentControls}>
        <Button
          title="unsure"
          variant={state.confidence === "unsure" ? "danger" : "ghost"}
          onPress={() => toggleConfidence("unsure")}
          height={40}
          style={{ marginRight: 20, ...styles.assessmentButton }}
          iconName="close"
          iconSize={18}
          iconStyle={styles.assessmentButtonIcon}
        />
        <Button
          title="sure"
          variant={state.confidence === "sure" ? "success" : "ghost"}
          onPress={() => toggleConfidence("sure")}
          height={40}
          style={styles.assessmentButton}
          iconName="check"
          iconSize={18}
          iconStyle={styles.assessmentButtonIcon}
        />
      </View>
      <Button
        title="next"
        variant={
          state.translation.trim() && state.confidence ? "primary" : "ghost"
        }
        disabled={!state.translation.trim() || !state.confidence}
        onPress={() => {}}
        style={styles.nextButton}
        height={65}
        iconName="chevron.right"
        iconPosition="right"
        iconSize={28}
        iconStyle={styles.nextButtonIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  progressBar: {
    height: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
  },
  closeButton: {
    width: 27,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {},
  timeContainer: {
    height: 27,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "white",
  },
  timeIcon: { marginRight: 5 },
  timeText: { fontSize: 16 },
  progressTextIndicator: {
    fontSize: 16,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 27,
  },
  title: {
    fontWeight: "400",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  cardContainer: {
    width: "100%",
    minHeight: 200,
    marginTop: 30,
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 30,
    overflow: "hidden",
  },
  nativeText: {
    flex: 1,
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
    textAlignVertical: "center",
  },
  voiceButton: {
    width: 60,
    height: 60,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 17,
  },
  volumeIcon: {},
  inputLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    marginTop: 20,
  },
  input: {
    minHeight: 70,
    maxHeight: 150,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 17,
    padding: 15,
    fontSize: 16,
    textAlignVertical: "top",
  },
  assessmentControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 20,
    flex: 1,
    fontSize: 14,
  },
  assessmentButton: {
    flex: 1,
  },
  assessmentButtonIcon: {
    marginRight: 5,
  },
  nextButton: {
    marginVertical: 30,
    fontSize: 20,
    fontWeight: "bold",
  },
  nextButtonIcon: {
    marginLeft: 2,
  },
});
