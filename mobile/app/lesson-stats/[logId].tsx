import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { LoadingState } from "@/components/states/LoadingState";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { statService } from "@/services/statService";
import { LogDetails } from "@/types/stat";
import { formatMsToTime } from "@/utils/time";

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
      console.log(data);
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

      <View style={styles.commonScoresContainer}>
        <View
          style={[
            styles.commonScoreCard,
            { backgroundColor: colors.itemGlass },
          ]}
        >
          <View style={styles.commonScoreCardInnerRow}>
            <IconSymbol name="target" size={16} color={colors.success} />
            <Text style={[styles.commonScoreText, { color: colors.success }]}>
              {`${state.accuracy}%`}
            </Text>
          </View>
          <Text style={[styles.commonScoreLabel, { color: colors.text }]}>
            Дәлдік
          </Text>
        </View>
        <View
          style={[
            styles.commonScoreCard,
            { backgroundColor: colors.itemGlass },
          ]}
        >
          <View style={styles.commonScoreCardInnerRow}>
            <IconSymbol name="chart" size={16} color={colors.title} />
            <Text style={[styles.commonScoreText, { color: colors.title }]}>
              {`${state.confidence}%`}
            </Text>
          </View>
          <Text style={[styles.commonScoreLabel, { color: colors.text }]}>
            Сенімділік
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.commonScoreCard,
          { backgroundColor: colors.itemGlass, marginTop: 16, width: "100%" },
        ]}
      >
        <View style={styles.commonScoreCardInnerRow}>
          <Text
            style={[
              styles.commonScoreLabel,
              { color: colors.title, lineHeight: 14 },
            ]}
          >
            <IconSymbol
              name="access-time"
              size={14}
              color={colors.title}
              style={{
                justifyContent: "center",
                alignItems: "center",
                lineHeight: 18,
              }}
            />
            {" Жалпы уақыт:"}
          </Text>
          <Text style={[styles.commonScoreText, { color: colors.title }]}>
            {`${state.time_efficiency}%`}
          </Text>
        </View>

        <View style={styles.commonScoreCardInnerRow}>
          <Text style={[styles.commonScoreLabel, { color: colors.title }]}>
            <IconSymbol
              name="error"
              size={14}
              color={colors.title}
              style={{ justifyContent: "center", alignItems: "center" }}
            />
            {" Артық жұмсалды:"}
          </Text>
          <Text style={[styles.commonScoreText, { color: colors.error }]}>
            {formatMsToTime(state.time_overuse_ms)}
          </Text>
        </View>
      </View>

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
          <View
            key={item.id || index}
            style={[
              styles.itemCard,
              {
                backgroundColor: colors.itemGlass,
                borderColor: colors.itemBorder,
              },
            ]}
          >
            <View style={styles.itemCardTopBar}>
              <Text style={[styles.itemIndexLabel, { color: colors.label }]}>
                {`Сөйлем #${index + 1}`}
              </Text>
              <View
                style={[
                  styles.itemCardAccuracyContainer,
                  { backgroundColor: colors.itemInnerGlass },
                ]}
              >
                <Text
                  style={[
                    styles.itemCardAccuracyText,
                    { color: colors.warning },
                  ]}
                >
                  {`${item.accuracy * 100}%`}
                </Text>
              </View>
            </View>

            <View style={styles.sourceContainer}>
              <View
                style={[
                  styles.langCodeContainer,
                  { backgroundColor: colors.itemInnerGlass },
                ]}
              >
                <Text style={[styles.langCodeText, { color: colors.label }]}>
                  {state.native_lang}
                </Text>
              </View>
              <Text style={[styles.sourceText, { color: colors.text }]}>
                {item.target_text}
              </Text>
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
              style={[
                styles.itemCardBottomBar,
                { borderTopColor: colors.itemBorder },
              ]}
            >
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Text
                  style={[styles.itemCardBottomText, { color: colors.label }]}
                >
                  <IconSymbol
                    name="access-time"
                    size={10}
                    color={colors.label}
                  />
                  {` ${formatMsToTime(item.response_time_ms)}`}
                </Text>
                <Text
                  style={[[styles.itemCardBottomText, { color: colors.label }]]}
                >
                  <IconSymbol name="bolt" size={10} color={colors.label} />
                  {` ${item.confidence * 100}% сенімді`}
                </Text>
              </View>
              <View
                style={[
                  styles.transDirection,
                  { backgroundColor: colors.itemGlass },
                ]}
              >
                <Text
                  style={[styles.transDirectionText, { color: colors.label }]}
                >
                  {`${state.native_lang} › ${state.target_lang}`}
                </Text>
              </View>
            </View>
          </View>
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
  commonScoresContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  commonScoreCard: {
    flex: 1,
    padding: 16,
    borderRadius: 30,
    justifyContent: "center",
  },
  commonScoreCardInnerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commonScoreText: {
    fontSize: 12,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
  },
  commonScoreLabel: {
    fontSize: 14,
    fontWeight: "black",
    textAlignVertical: "center",
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
  itemCard: {
    width: "100%",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
  },
  itemCardTopBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  itemIndexLabel: {
    width: 100,
    fontSize: 9,
    textTransform: "uppercase",
  },
  itemCardAccuracyContainer: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  itemCardAccuracyText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  sourceContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 16,
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
    width: "100%",
    fontSize: 14,
  },
  responseLabel: {
    width: "100%",
    fontSize: 8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  responseText: {
    width: "100%",
    fontSize: 12,
    marginBottom: 16,
  },
  itemCardBottomBar: {
    width: "100%",
    borderTopWidth: 0.3,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  itemCardBottomText: {
    fontSize: 10,
    textAlignVertical: "center",
  },
  transDirection: {
    width: 40,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  transDirectionText: {
    fontSize: 8,
    textAlignVertical: "center",
    textTransform: "uppercase",
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
