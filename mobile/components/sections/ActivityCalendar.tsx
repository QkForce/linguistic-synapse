import { useMemo } from "react";
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Intensity } from "@/types/stat";
import { getDaysInMonth } from "@/utils/time";

type ActivityCalendarProps = {
  monthYear: Date;
  activities: Record<string, Intensity>;
  bgColorScale: readonly [
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue,
  ];
  textColorScale: readonly [
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue,
  ];
  style: StyleProp<ViewStyle>;
};

type CalendarData = {
  day: number | null;
  bgColor: ColorValue;
  borderColor: ColorValue;
  textColor: ColorValue;
};

function Cell({
  day,
  bgColor,
  borderColor,
  textColor,
}: {
  day: number | null;
  bgColor: ColorValue;
  borderColor: ColorValue;
  textColor: ColorValue;
}) {
  return (
    <View
      style={[
        styles.day,
        { backgroundColor: bgColor, borderColor: borderColor },
      ]}
    >
      <Text style={[styles.dayText, { color: textColor }]} children={day} />
    </View>
  );
}

export function ActivityCalendar({
  monthYear,
  activities,
  bgColorScale,
  textColorScale,
  style,
}: ActivityCalendarProps) {
  const colors = useThemeColor();

  const calendarData = useMemo(() => {
    const now = new Date();
    const selectedYear = monthYear.getFullYear();
    const selectedMonth = monthYear.getMonth();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const startingPoint = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const empty_cell = {
      day: null,
      bgColor: "transparent",
      borderColor: "transparent",
      textColor: "transparent",
    };
    const missingParts = (7 - ((startingPoint + daysInMonth) % 7)) % 7;
    const cells = Array.from(
      { length: (startingPoint + daysInMonth + missingParts) / 7 },
      (_, i) => [] as CalendarData[],
    );
    const isCurrentMonth =
      selectedYear === now.getFullYear() && selectedMonth === now.getMonth();
    for (let i = 0; i < startingPoint; i++) cells[0].push(empty_cell);
    for (let i = 1; i <= daysInMonth; i++) {
      const monthString = String(selectedMonth + 1).padStart(2, "0");
      const dayString = String(i).padStart(2, "0");
      const dateString = `${selectedYear}-${monthString}-${dayString}`;
      const isInActivity = dateString in activities;
      let isCurrentDay = isCurrentMonth && now.getDate() === i;
      cells[Math.floor((startingPoint + i - 1) / 7)].push({
        day: i,
        bgColor: isInActivity
          ? bgColorScale[activities[dateString] ?? 0]
          : bgColorScale[0],
        borderColor: isCurrentDay ? colors.warning : "transparent",
        textColor: isInActivity
          ? textColorScale[activities[dateString] ?? 0]
          : textColorScale[0],
      });
    }
    for (let i = 0; i < missingParts; i++)
      cells[Math.floor((startingPoint + daysInMonth + i) / 7)].push(empty_cell);
    return cells;
  }, [monthYear, activities]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.itemGlass, borderColor: colors.itemBorder },
        style,
      ]}
    >
      <View style={styles.topBar}>
        <View style={{ flexDirection: "row" }}>
          <IconSymbol
            name="activity"
            size={12}
            color={colors.title}
            style={styles.activityIcon}
          />
          <Text
            style={[styles.title, { color: colors.label }]}
            children="Жүйелілік"
          />
        </View>
        <View style={styles.scaleContainer}>
          <Text
            style={[styles.scaleLabel, { color: colors.label }]}
            children="Less"
          />
          {bgColorScale.map((bg, i) => (
            <View
              key={i}
              style={[styles.scaleItem, { backgroundColor: bgColorScale[i] }]}
            />
          ))}
          <Text
            style={[styles.scaleLabel, { color: colors.label }]}
            children="More"
          />
        </View>
      </View>

      <View style={styles.calendarHeader}>
        {["Дс", "Сс", "Ср", "Бс", "Жм", "Сн", "Жк"].map((d) => (
          <Text
            key={d}
            style={[styles.headerItem, { color: colors.label }]}
            children={d}
          />
        ))}
      </View>

      <View style={styles.calendarBody}>
        {calendarData.map((row, i) => (
          <View key={i} style={styles.calendarRow}>
            {row.map((cell, j) => (
              <Cell
                key={j}
                day={cell.day}
                bgColor={cell.bgColor}
                borderColor={cell.borderColor}
                textColor={cell.textColor}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderWidth: 0.5,
    borderRadius: 20,
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 12,
    textTransform: "uppercase",
    textAlignVertical: "center",
  },
  activityIcon: {
    padding: 5,
  },
  scaleContainer: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  scaleLabel: {
    fontSize: 12,
    textAlignVertical: "center",
  },
  scaleItem: {
    height: 12,
    width: 12,
    borderRadius: 4,
  },
  calendarHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerItem: {
    width: 30,
    height: 30,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 11,
    fontWeight: "black",
    marginBottom: 4,
  },
  calendarBody: {
    gap: 5,
  },
  calendarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  day: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  dayText: {
    fontSize: 10,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
