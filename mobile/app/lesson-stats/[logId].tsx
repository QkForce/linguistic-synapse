import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { LoadingState } from "@/components/states/LoadingState";
import { useThemeColor } from "@/hooks/useThemeColor";
import { statService } from "@/services/statService";
import { LogDetails } from "@/types/stat";

type ScreenStatus = "loading" | "success" | "error" | "empty";

export default function StatDetailScreen() {
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.title }]}>
        {state.lesson_title}
      </Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Log: {logId}
      </Text>
      <View style={styles.statsPlaceholder}>
        <Text style={{ color: colors.label }}>
          Statistics are coming soon...
        </Text>
      </View>

      <Button
        title="Go to Home"
        onPress={() => router.replace("/(tabs)")}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 40 },
  statsPlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  button: { width: "100%", marginTop: 20 },
});
