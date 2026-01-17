import { Button } from "@/components/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function StatDetailScreen() {
  const { logId } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColor();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.title }]}>
        Lesson Results!
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
