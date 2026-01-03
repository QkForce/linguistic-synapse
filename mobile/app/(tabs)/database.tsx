import { StyleSheet, Text, View } from "react-native";

import Button from "@/components/Button";
import { gradients } from "@/constants/Colors";
import { importSQLiteFile } from "@/utils/sqliteUtils";

export default function DatabaseScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>
      <Button
        title="Импортировать базы данных"
        onPress={async () => {
          const success = await importSQLiteFile();
          if (success) {
            alert("Деректер қоры жаңартылды! Қосымшаны қайта іске қосыңыз.");
          }
        }}
        iconName="file.download"
        gradient={gradients.purple}
        buttonStyle={{ height: 48, marginBottom: 16 }}
        buttonGradientStyle={styles.importButton}
        textStyle={styles.importButtonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "flex-start" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 24 },
  path: { marginTop: 16, fontSize: 12, color: "#888" },
  importButton: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  importButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
