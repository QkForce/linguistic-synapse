import { Stack } from "expo-router";

export default function LessonStatsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[logId]"
        options={{
          title: "Сабақ нәтижесі",
          headerBackTitle: "Артқа",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
