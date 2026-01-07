import { StyleSheet, Text, View } from "react-native";

export default function LessonScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lesson Content Goes Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
