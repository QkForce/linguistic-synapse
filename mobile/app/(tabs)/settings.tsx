import * as DocumentPicker from "expo-document-picker";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { dataTransferService } from "@/services/dataTransferService";
import { importSQLiteFile } from "@/utils/sqliteUtils";

export default function DatabaseScreen() {
  const colors = useThemeColor();

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const fileUri = result.assets[0].uri;
        await dataTransferService.importCategory(fileUri);
        alert("Категория сәтті импортталды!");
      }
    } catch (error) {
      alert("Импорт кезінде қате шықты");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>
      <Button
        title="ДҚ-ны импорттау"
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
      <Button
        title="Import category"
        onPress={handleImport}
        iconName="file.download"
        style={styles.importButton}
        variant="primary"
      />
      <Button
        title="Категорияны экспорттау"
        onPress={() => {}}
        iconName="file.upload"
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
