import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { importSQLiteFile } from "@/utils/sqliteUtils";

export default function DatabaseScreen() {
  const colors = useThemeColor();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>
      <Button
        title="Импортировать БД"
        onPress={async () => {
          const success = await importSQLiteFile();
          if (success) {
            alert("Деректер қоры жаңартылды! Қосымшаны қайта іске қосыңыз.");
          }
        }}
        iconName="file.download"
        style={styles.importButton}
        variant="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "flex-start" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 24 },
  importButton: {
    marginTop: 20,
  },
});
