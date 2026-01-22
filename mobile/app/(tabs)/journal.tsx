import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorState } from "@/components/states/ErrorState";
import { LoadingState } from "@/components/states/LoadingState";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LessonLog } from "@/types/stat";

type ScreenStatus = "loading" | "success" | "error" | "empty";

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useThemeColor();
  const [status, setStatus] = useState<ScreenStatus>("loading");
  const [date, setDate] = useState<Date>(new Date());
  const [state, setState] = useState<LessonLog[]>([]);

  useEffect(() => {
    loadData();
  }, [date]);

  const loadData = async () => {
    try {
      setStatus("loading");
      const data = [] as LessonLog[];
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
        <TouchableHighlight style={styles.navButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.title} />
        </TouchableHighlight>

        <TouchableHighlight>
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

        <TouchableHighlight style={styles.navButton}>
          <IconSymbol name="chevron.right" size={24} color={colors.title} />
        </TouchableHighlight>
      </View>
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
});
