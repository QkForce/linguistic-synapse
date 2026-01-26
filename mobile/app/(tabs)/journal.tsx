import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { JournalItem } from "@/components/items/JournalItem";
import { MonthYearPickerModal } from "@/components/modals/MonthYearPickerModal";
import { ActivityCalendar } from "@/components/sections/ActivityCalendar";
import { ErrorState } from "@/components/states/ErrorState";
import { LoadingState } from "@/components/states/LoadingState";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeGradient } from "@/hooks/useThemeGradient";
import { statService } from "@/services/statService";
import { Intensity, LessonLog } from "@/types/stat";
import { convertLogsToActivityRecord } from "@/utils/journalUtils";
import { calculateMonthlyStats } from "@/utils/scoring";
import { getDaysInMonth } from "@/utils/time";

type ScreenStatus = "loading" | "success" | "error" | "empty";

interface JournalState {
  logs: LessonLog[];
  activities: Record<string, Intensity>;
}

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useThemeColor();
  const gradColors = useThemeGradient();
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<ScreenStatus>("loading");
  const [date, setDate] = useState<Date>(new Date());
  const [state, setState] = useState<JournalState>({
    activities: {},
    logs: [],
  });

  useEffect(() => {
    loadData();
  }, [date]);

  const loadData = async () => {
    try {
      setStatus("loading");
      const logs = await statService.getJournalLogs(
        date.getFullYear(),
        date.getMonth(),
      );
      if (!logs || logs.length === 0) {
        setStatus("empty");
        setState({ logs: [], activities: {} });
        return;
      }
      const activities = convertLogsToActivityRecord(logs);
      setState({ logs, activities });
      setStatus("success");
    } catch (e) {
      setStatus("error");
    }
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + offset);
    setDate(newDate);
  };

  const changeMonthYear = (month: number, year: number) => {
    const newDate = new Date(date);
    newDate.setMonth(month);
    newDate.setFullYear(year);
    setDate(newDate);
    setIsPickerOpen(false);
  };

  if (status === "loading") {
    return (
      <LoadingState title="Loading" description="Stat details are loading!" />
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
  const activDays = Object.keys(state.activities).length;
  const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());
  const { monthlyAccuracy } = calculateMonthlyStats(state.logs);
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.itemBorder,
          },
        ]}
      >
        <TouchableHighlight
          onPress={() => changeMonth(-1)}
          style={styles.navButton}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.title} />
        </TouchableHighlight>

        <TouchableHighlight onPress={() => setIsPickerOpen(true)}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.monthTitle, { color: colors.title }]}>
              {date.toLocaleString("kk-KZ", { month: "long" })}
              <IconSymbol
                name="keyboard-arrow-down"
                size={16}
                color={colors.title}
                style={styles.arrowDownIcon}
              />
            </Text>
            <Text style={[styles.yearTitle, { color: colors.title }]}>
              {date.getFullYear()}
            </Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => changeMonth(1)}
          style={styles.navButton}
        >
          <IconSymbol name="chevron.right" size={24} color={colors.title} />
        </TouchableHighlight>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <ActivityCalendar
          monthYear={date}
          activities={state.activities}
          bgColorScale={gradColors.heatmapBg}
          textColorScale={gradColors.heatmapText}
          style={styles.calendar}
        />

        <View style={styles.summayRow}>
          <View
            style={[
              styles.summary,
              {
                backgroundColor: colors.itemGlass,
                borderColor: colors.itemBorder,
              },
            ]}
          >
            <IconSymbol name="bolt" size={18} color={colors.title} />
            <Text
              style={[styles.summaryText, { color: colors.text }]}
              children={`${activDays} / ${daysInMonth}`}
            />
            <Text
              style={[styles.summaryLabel, { color: colors.label }]}
              children="Белсенді күндер"
            />
          </View>

          <View
            style={[
              styles.summary,
              {
                backgroundColor: colors.successBackground,
                borderColor: colors.itemBorder,
              },
            ]}
          >
            <IconSymbol name="target" size={18} color={colors.title} />
            <Text
              style={[styles.summaryText, { color: colors.text }]}
              children={`${monthlyAccuracy}%`}
            />
            <Text
              style={[styles.summaryLabel, { color: colors.label }]}
              children="Орташа дәлдік"
            />
          </View>
        </View>

        <View style={styles.monthlyLessonsHeader}>
          <Text
            style={[styles.monthlyLessonsTitle, { color: colors.label }]}
            children="Айлық журнал"
          />
          <Text
            style={[
              styles.totalLessons,
              { color: colors.label, backgroundColor: colors.itemGlass },
            ]}
            children={`${state.logs.length} сабақ`}
          />
        </View>

        <View style={styles.lessonLogs}>
          {state.logs.map((log, i) => (
            <JournalItem
              key={i}
              dateString={log.created_at}
              lesson_title={log.lesson_title}
              accuracy={Math.round(log.accuracy)}
              onPress={() => router.push(`/lesson-stats/${log.id}`)}
            />
          ))}
        </View>
      </ScrollView>
      {isPickerOpen && (
        <MonthYearPickerModal
          visible={isPickerOpen}
          initialMonth={date.getMonth()}
          initialYear={date.getFullYear()}
          onClose={() => setIsPickerOpen(false)}
          onApply={(month, year) => changeMonthYear(month, year)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
  },
  navButton: {
    width: 40,
    height: 40,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
  },
  monthTitle: {
    fontSize: 20,
    textAlignVertical: "center",
  },
  arrowDownIcon: {
    marginLeft: 3,
  },
  yearTitle: {
    fontSize: 10,
    textAlign: "center",
  },
  calendar: {
    marginVertical: 30,
    marginHorizontal: 20,
  },
  summayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    gap: 12,
  },
  summary: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
  },
  summaryIcon: {
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 20,
    fontWeight: "700",
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  monthlyLessonsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginHorizontal: 28,
  },
  monthlyLessonsTitle: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  totalLessons: {
    fontSize: 9,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 18,
  },
  lessonLogs: {
    marginTop: 16,
    marginHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
});
