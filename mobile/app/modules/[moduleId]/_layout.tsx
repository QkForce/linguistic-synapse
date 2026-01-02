import { Stack } from "expo-router";

export default function CourseLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen name="edit" options={{ title: "Edit Course" }} />
    </Stack>
  );
}
