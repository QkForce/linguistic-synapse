import { Stack } from "expo-router";

export default function LessonStatsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[logId]" />
    </Stack>
  );
}
