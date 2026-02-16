import { StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

type CountdownStateProps = {
  countdown: number;
};

export function CountdownState({ countdown }: CountdownStateProps) {
  const colors = useThemeColor();

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <Text style={[styles.countdownText, { color: colors.text }]}>
        {countdown}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  countdownText: {
    fontSize: 96,
  },
});
