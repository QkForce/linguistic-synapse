import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { LoadingState } from "@/components/states/LoadingState";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useCurrentTheme, useThemeColor } from "@/hooks/useThemeColor";
import { useThemeGradient } from "@/hooks/useThemeGradient";
import { useTimer } from "@/hooks/useTimer";
import { lessonService } from "@/services/lessonService";
import { Exercise, SentenceResult } from "@/types/lesson";
import { calculateLessonStats, prepareSentenceResult } from "@/utils/scoring";

interface ExerciseState {
  lessonTitle: string;
  sentences: Exercise[];
  currentNativeSentence: string;
  currentSentenceIndex: number;
  totalSentences: number;
  translation: string;
  confidence: "sure" | "unsure" | null;
  startTime: number;
  results: SentenceResult[];
}

type ScreenStatus = "loading" | "success" | "error" | "empty";

export default function LessonScreen() {
  const { moduleId, lessonId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const gradColors = useThemeGradient("brand");
  const colors = useThemeColor();
  const theme = useCurrentTheme();
  const router = useRouter();
  const { timeString } = useTimer(true);
  const [status, setStatus] = useState<ScreenStatus>("loading");
  const [nativeLang, setNativeLang] = useState("kk");
  const [targetLang, setTargetLang] = useState("en");
  const [state, setState] = useState<ExerciseState>({
    lessonTitle: "",
    sentences: [],
    currentNativeSentence: "",
    currentSentenceIndex: 0,
    totalSentences: 0,
    translation: "",
    confidence: null,
    startTime: Date.now(),
    results: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setStatus("loading");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const data = lessonService.getExercisesByLessonId(
        Number(lessonId),
        nativeLang,
        targetLang,
      );
      if (!data || data.length === 0) {
        setStatus("empty");
        return;
      }
      setState((prev) => ({
        ...prev,
        lessonTitle: data[0].lesson_title,
        sentences: data,
        currentNativeSentence: data[0].native_text,
        currentSentenceIndex: 0,
        totalSentences: data.length,
      }));
      setStatus("success");
    } catch (e) {
      setStatus("error");
    }
  };

  const toggleConfidence = (value: "sure" | "unsure") => {
    setState((prev) => ({
      ...prev,
      confidence: value,
    }));
  };

  const handleClose = () => {
    Alert.alert(
      "Stop training",
      "Are you sure you want to quit? Progress will not be saved.",
      [
        { text: "Stay", style: "cancel" },
        { text: "Quit", style: "destructive", onPress: () => router.back() },
      ],
    );
  };

  const handleNext = () => {
    const endTime = Date.now();
    const currentEx = state.sentences[state.currentSentenceIndex];
    const currentResult = prepareSentenceResult(
      currentEx.id,
      currentEx.native_text,
      currentEx.target_text,
      state.translation,
      state.confidence === "sure" ? 1.0 : 0.5,
      endTime - state.startTime,
      targetLang,
    );

    const updatedResults = [...state.results, currentResult];
    const nextIndex = state.currentSentenceIndex + 1;

    if (nextIndex < state.sentences.length) {
      setState((prev) => ({
        ...prev,
        currentSentenceIndex: nextIndex,
        currentNativeSentence: state.sentences[nextIndex].native_text,
        translation: "",
        confidence: null,
        startTime: Date.now(),
        results: updatedResults,
      }));
    } else {
      finishLesson(updatedResults);
    }
  };

  const finishLesson = (finalResults: SentenceResult[]) => {
    try {
      const stats = calculateLessonStats(finalResults);
      const logId = lessonService.saveLessonResults(
        Number(lessonId),
        {
          ...stats,
          native_lang: nativeLang,
          target_lang: targetLang,
        },
        finalResults,
      );
      Alert.alert("Керемет!", "Жаттығу аяқталды, нәтижелер сақталды.", [
        {
          text: "OK",
          onPress: () =>
            router.replace({
              pathname: `/lesson-stats/[logId]`,
              params: { logId: logId },
            }),
        },
      ]);
    } catch (error) {
      Alert.alert("Қате", "Нәтижелерді сақтау мүмкін болмады.");
    }
  };

  if (status === "loading")
    return (
      <LoadingState title="Loading" description="Data is being retrieved." />
    );

  if (status === "error")
    return (
      <ErrorState
        title="Error"
        description="An erroroccurred"
        onPressRetry={loadData}
        onPressClose={() => router.back()}
      />
    );

  if (status === "empty")
    return (
      <EmptyState
        title="Data not found"
        description="Currently, lessons for this section are not in the database or have not been loaded."
        onPressClose={() => router.back()}
      />
    );

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { paddingTop: insets.top + 16, backgroundColor: colors.background },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? -insets.top : 0}
    >
      <StatusBar style={theme} />
      <ProgressBar
        current={state.currentSentenceIndex}
        total={state.totalSentences}
        indicatorGradient={gradColors}
        style={styles.progressBar}
      />

      <View style={styles.header}>
        <Pressable onPress={handleClose} style={styles.closeButton}>
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
            {timeString}
          </Text>
        </View>
        <Text
          style={[styles.progressTextIndicator, { color: colors.label }]}
        >{`${state.currentSentenceIndex} / ${state.totalSentences}`}</Text>
      </View>
      <Text style={[styles.title, { color: colors.title }]}>
        {state.lessonTitle}
      </Text>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.cardContainer,
            {
              borderColor: colors.itemBorder,
              backgroundColor: colors.itemGlass,
            },
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
          autoFocus={true}
          returnKeyType="done"
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
          title={
            state.currentSentenceIndex === state.totalSentences - 1
              ? "finish"
              : "next"
          }
          variant={
            state.translation.trim() && state.confidence ? "primary" : "ghost"
          }
          disabled={!state.translation.trim() || !state.confidence}
          onPress={handleNext}
          style={styles.nextButton}
          height={65}
          iconName="chevron.right"
          iconPosition="right"
          iconSize={28}
          iconStyle={styles.nextButtonIcon}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const styles = StyleSheet.create({
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
