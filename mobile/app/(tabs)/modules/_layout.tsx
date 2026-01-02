import { Stack } from "expo-router";

export default function ModulesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: false,
      }}
    >
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="index" options={{}} />
    </Stack>
  );
}
