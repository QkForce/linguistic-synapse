import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { LessonStatsItem } from "@/components/items/LessonStatsItem";
import { StatsSummary } from "@/components/sections/StatsSummary";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { LoadingState } from "@/components/states/LoadingState";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { statService } from "@/services/statService";
import { LogDetails } from "@/types/stat";

type ScreenStatus = "loading" | "success" | "error" | "empty";

export default function StatDetailScreen() {
  const insets = useSafeAreaInsets();
  const { logId } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColor();
  const [status, setStatus] = useState<ScreenStatus>("loading");
  const [state, setState] = useState<LogDetails | null>(null);

  useEffect(() => {
    loadData();
  }, [logId]);

  const loadData = async () => {
    try {
      setStatus("loading");
      const data = await statService.getLogDetails(Number(logId));
      if (!data) {
        setStatus("empty");
        return;
      }
      setState(data);
      setStatus("success");
    } catch (e) {
      setStatus("error");
    }
  };

  if (status === "loading") {
    return (
      <LoadingState title="Loading" description="Stat details are loading!" />
    );
  }
  if (status === "empty" || state == null) {
    return (
      <EmptyState
        title="Empty state"
        description="There is no data!"
        onPressClose={() => router.back()}
      />
    );
  }
  if (status === "error") {
    return (
      <ErrorState
        title="Empty state"
        description="There is no data!"
        onPressRetry={loadData}
        onPressClose={() => router.back()}
      />
    );
  }
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
    >
      <View
        style={[
          styles.cupIconContainer,
          { backgroundColor: colors.awardIconBg },
        ]}
      >
        <IconSymbol name="trophy" size={40} color={colors.awardIconContent} />
      </View>

      <Text style={[styles.moduleTitle, { color: colors.title }]}>
        {state.module_title}
      </Text>
      <Text style={[styles.lessonTitle, { color: colors.description }]}>
        {state.lesson_title}
      </Text>

      <View style={styles.dateContainer}>
        <IconSymbol
          name="calendar"
          size={10}
          color={colors.label}
          style={styles.dateIcon}
        />
        <Text style={[styles.dateText, { color: colors.label }]}>
          {state.created_at.substring(0, 16)}
        </Text>
      </View>

      <View
        style={[styles.finalScoreCard, { backgroundColor: colors.itemGlass }]}
      >
        <Text
          style={[
            styles.finalScoreText,
            { color: colors.title, textShadowColor: colors.titleShadow },
          ]}
        >
          {state.final_score}
        </Text>
        <Text style={[styles.finalScoreLabel, { color: colors.label }]}>
          ұпай жиналды
        </Text>
      </View>

      <StatsSummary state={state} />

      <View style={styles.sentencesLabelRow}>
        <IconSymbol
          name="message"
          size={14}
          color={colors.label}
          style={{ marginRight: 5 }}
        />
        <Text style={[styles.sentencesLabel, { color: colors.label }]}>
          Сөйлемдер талдауы:
        </Text>
      </View>

      <View style={styles.sentencesContainer}>
        {state.sentences.map((item, index) => (
          <LessonStatsItem
            item={item}
            nativeLang={state.native_lang}
            targetLang={state.target_lang}
            index={index}
            key={index}
          />
        ))}
      </View>

      <View style={styles.buttons}>
        <Button
          variant="primary"
          title="Қайталау"
          iconName="replay"
          onPress={() => {}}
          style={styles.button}
          iconStyle={{ marginRight: 8 }}
        />
        <Button
          variant="ghost"
          title="Мәзірге қайту"
          iconName="house.fill"
          onPress={() => router.replace("/(tabs)")}
          style={styles.button}
          iconStyle={{ marginRight: 8 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
  },
  cupIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  moduleTitle: {
    width: "100%",
    fontSize: 12,
    marginTop: 16,
    textAlign: "center",
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  dateIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  dateText: {
    fontSize: 10,
    textAlignVertical: "center",
    // borderWidth: 1,
    // borderColor: "white",
  },
  finalScoreCard: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    padding: 24,
    borderRadius: 40,
    overflow: "hidden",
  },
  finalScoreText: {
    fontSize: 48,
    textAlign: "center",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
    elevation: 20,
  },
  finalScoreLabel: {
    width: "100%",
    fontSize: 10,
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 5,
    fontWeight: "bold",
    // borderWidth: 1,
    // borderColor: "white",
  },
  sentencesLabelRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 32,
  },
  sentencesLabel: {
    fontSize: 12,
    textTransform: "uppercase",
  },
  sentencesContainer: {
    marginTop: 32,
    gap: 16,
  },
  buttons: {
    width: "100%",
    marginVertical: 32,
    gap: 12,
  },
  button: {
    width: "100%",
  },
});
