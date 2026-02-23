import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { CountdownState } from "@/components/states/CountdownState";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { LoadingState } from "@/components/states/LoadingState";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useExerciseAnimations } from "@/hooks/useExerciseAnimations";
import { useExerciseTimer } from "@/hooks/useExerciseTimer";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { countdown, isReady } = useExerciseTimer(
    status === "success" ? 3 : null,
  );
  const limit = 10;
  const [state, setState] = useState<ExerciseState>({
    categoryTitle: "",
    sentences: [],
    currentNativeSentence: "",
    currentSentenceIndex: 0,
    totalSentences: 0,
    translation: "",
    confidence: null,
    startTime: 0,
    results: [],
  });
  const { animatedDockedCapsuleStyle, animatedNativeTextStyle } =
    useExerciseAnimations(isReady, isKeyboardOpen, insets);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardOpen(true),
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardOpen(false),
    );
    loadData();
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (status === "success" && isReady) {
      setState((prev) => ({ ...prev, startTime: Date.now() }));
      inputRef.current?.focus();
    }
  }, [status, isReady]);

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
        <Pressable
          onPress={handleClose}
          style={[
            styles.headerButton,
            {
              backgroundColor: colors.itemInnerGlass,
              borderColor: colors.itemBorder,
            },
          ]}
        >
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
        <Pressable
          style={[
            styles.headerButton,
            {
              backgroundColor: colors.itemInnerGlass,
              borderColor: colors.itemBorder,
            },
          ]}
        >
          <IconSymbol name="volume-up" color={colors.title} size={24} />
        </Pressable>
      </View>

      {/* Progress Line (Super thin) */}
      <ProgressBar
        current={state.currentSentenceIndex}
        total={state.totalSentences}
        indicatorGradient={gradColors}
        style={[
          styles.progressBar,
          { backgroundColor: colors.progressTrack, width: SCREEN_WIDTH - 64 },
        ]}
      />

      {/* Task Content */}
      {isReady ? (
        <Animated.Text
          style={[
            styles.nativeText,
            animatedNativeTextStyle,
            { color: colors.title },
          ]}
        >
          {state.currentNativeSentence}
        </Animated.Text>
      ) : (
        <CountdownState countdown={countdown} />
      )}

      {/* Docked or Floating Capsule */}
      <Animated.View
        style={[
          styles.dockedContainer,
          { backgroundColor: colors.itemInnerGlass },
          animatedDockedCapsuleStyle,
        ]}
      >
        <TextInput
          ref={inputRef}
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
          placeholder="Type translation here…"
          placeholderTextColor={colors.placeholder}
          editable={isReady}
        />

        {/* Action Controls */}
        <View style={styles.actionControls}>
          {/* Confidence Toggle */}
          <View
            style={[
              styles.confidenceButtons,
              { backgroundColor: colors.itemInnerGlass },
            ]}
          >
            <Button
              title="unsure"
              variant={state.confidence === "unsure" ? "danger" : "ghost"}
              onPress={() => toggleConfidence("unsure")}
              style={styles.assessmentButton}
              iconName="close"
              iconSize={18}
              iconStyle={styles.assessmentButtonIcon}
              disabled={!isReady}
            />
            <Button
              title="sure"
              variant={state.confidence === "sure" ? "success" : "ghost"}
              onPress={() => toggleConfidence("sure")}
              style={styles.assessmentButton}
              iconName="check"
              iconSize={18}
              iconStyle={styles.assessmentButtonIcon}
              disabled={!isReady}
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
            iconName="chevron.right"
            iconPosition="right"
            iconSize={18}
            iconStyle={styles.nextButtonIcon}
          />
        </View>
      </Animated.View>
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  headerButton: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
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
  progressBar: {
    height: 4,
    alignSelf: "center",
    marginVertical: 12,
  },
  nativeText: {
    flex: 1,
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
    textAlignVertical: "center",
  },
  dockedContainer: {
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 40,
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 24,
    padding: 15,
    fontSize: 16,
    textAlignVertical: "top",
  },
  actionControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
    gap: 10,
  },
  confidenceButtons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: 30,
  },
  assessmentButton: {
    flex: 1,
    height: 40,
    fontSize: 9,
    borderRadius: 20,
  },
  assessmentButtonIcon: {
    marginRight: 2,
  },
  nextButton: {
    width: "auto",
    height: 48,
    borderRadius: 24,
    fontSize: 14,
    fontWeight: "bold",
  },
  nextButtonIcon: {
    marginLeft: 2,
  },
});
