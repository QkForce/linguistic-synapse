import { Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { getShortMonthName, parseDateString } from "@/utils/time";
import { IconSymbol } from "../ui/IconSymbol";

type JournalItemProps = {
  dateString: string;
  lesson_title: string;
  accuracy: number;
  onPress: () => void;
};

export function JournalItem({
  dateString,
  lesson_title,
  accuracy,
  onPress,
}: JournalItemProps) {
  const colors = useThemeColor();
  const { month, date, timeString } = parseDateString(dateString);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: colors.itemGlass, borderColor: colors.itemBorder },
      ]}
    >
      <View
        style={[
          styles.date,
          {
            backgroundColor: colors.btnGlassBg,
            borderColor: colors.itemBorder,
          },
        ]}
      >
        <Text
          style={[styles.monthText, { color: colors.label }]}
          children={getShortMonthName(month - 1)}
        />
        <Text
          style={[styles.dateText, { color: colors.text }]}
          children={date}
        />
      </View>

      <View style={styles.middleContainer}>
        <Text
          style={[styles.lessonTitle, { color: colors.text }]}
          children={lesson_title}
        />
        <View style={styles.time}>
          <IconSymbol name="access-time" size={9} color={colors.title} />
          <Text
            style={[styles.timeText, { color: colors.label }]}
            children={timeString}
          />
        </View>
      </View>

      <View style={styles.lastContainer}>
        <View
          style={[
            styles.accuracy,
            { backgroundColor: colors.successBackground },
          ]}
        >
          <Text
            style={[styles.accuracyText, { color: colors.success }]}
            children={`${accuracy}%`}
          />
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.label} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderRadius: 12,
    alignItems: "center",
  },
  date: {
    width: 40,
    height: 40,
    borderWidth: 0.5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  monthText: {
    fontSize: 8,
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
    textTransform: "uppercase",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
  },
  middleContainer: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: "center",
  },
  lessonTitle: {
    fontSize: 12,
    fontWeight: "700",
    textAlignVertical: "center",
  },
  time: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    marginTop: 4,
  },
  timeText: {
    fontSize: 9,
    fontWeight: "700",
    textAlignVertical: "center",
  },
  lastContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  accuracy: {
    width: 45,
    borderRadius: 6,
    marginRight: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  accuracyText: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "right",
    textAlignVertical: "center",
  },
});
