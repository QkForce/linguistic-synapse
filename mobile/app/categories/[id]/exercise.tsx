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
import { exerciseService } from "@/services/exerciseService";
import { Exercise, SentenceResult } from "@/types/exercise";
import { calculateSessionStats, prepareSentenceResult } from "@/utils/scoring";

interface ExerciseState {
  categoryTitle: string;
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

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const gradColors = useThemeGradient("brand");
  const colors = useThemeColor();
  const theme = useCurrentTheme();
  const router = useRouter();
  const [status, setStatus] = useState<ScreenStatus>("loading");
  const [nativeLang, setNativeLang] = useState("kk");
  const [targetLang, setTargetLang] = useState("en");
  const limit = 10;
  const [state, setState] = useState<ExerciseState>({
    categoryTitle: "",
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
      const data = exerciseService.getExercisesByCategoryId(
        Number(id),
        nativeLang,
        targetLang,
        limit,
      );
      if (!data || data.length === 0) {
        setStatus("empty");
        return;
      }
      setState((prev) => ({
        ...prev,
        categoryTitle: data[0].cat_title,
        sentences: data,
        currentNativeSentence: data[0].native_text,
        currentSentenceIndex: 0,
        totalSentences: data.length,
      }));
      setStatus("success");
    } catch (e) {
      console.error("Error loading exercises:", e);
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
      finishSession(updatedResults);
    }
  };

  const finishSession = (finalResults: SentenceResult[]) => {
    try {
      const stats = calculateSessionStats(finalResults);
      const logId = exerciseService.saveExerciseResults(
        Number(id),
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
              pathname: `/session-stats/[logId]`,
              params: { logId: logId || "" },
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
        description="Currently, sentences for this section are not in the database or have not been loaded."
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

      {/* Header Area */}
      <View style={styles.header}>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <IconSymbol color={colors.title} name="close" />
        </Pressable>
        <View style={styles.headerCenterContainer}>
          <Text
            style={[styles.title, { color: colors.label }]}
            children={state.categoryTitle}
          />
          <Text
            style={[styles.progressTextIndicator, { color: colors.title }]}
            children={`${state.currentSentenceIndex}/${state.totalSentences}`}
          />
        </View>
        <Pressable style={[styles.voiceButton]}>
          <IconSymbol name="volume-up" color={colors.title} size={24} />
        </Pressable>
      </View>

      {/* Progress Line (Super thin) */}
      <ProgressBar
        current={state.currentSentenceIndex}
        total={state.totalSentences}
        indicatorGradient={gradColors}
        style={[styles.progressBar, { backgroundColor: colors.progressTrack }]}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 12,
  },
  closeButton: {
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenterContainer: {
    alignItems: "center",
    borderColor: "white",
  },
  title: {
    fontSize: 10,
    fontWeight: "400",
    textAlign: "center",
    textTransform: "uppercase",
  },
  progressTextIndicator: {
    fontSize: 16,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 27,
  },
  voiceButton: {
    paddingHorizontal: 8,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBar: {
    height: 2,
    borderRadius: 0,
  },
  cardContainer: {
    width: "100%",
    minHeight: 200,
    marginTop: 10,
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
