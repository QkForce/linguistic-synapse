import * as DocumentPicker from "expo-document-picker";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SettingsItem } from "@/components/items/SettingsItem";
import { SectionHeader } from "@/components/SectionHeader";
import { useThemeColor } from "@/hooks/useThemeColor";
import { dataTransferService } from "@/services/dataTransferService";
import { importSQLiteFile } from "@/utils/sqliteUtils";

export default function DatabaseScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();

  const hangleImportSQLite = async () => {
    const success = await importSQLiteFile();
    if (success) {
      alert("Деректер қоры жаңартылды! Қосымшаны қайта іске қосыңыз.");
    }
  };

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
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      <SectionHeader
        iconName="database"
        text="Деректерді басқару"
        style={styles.sectionHeader}
      />
      <SettingsItem
        iconName="file.download"
        title="ДҚ-ны импорттау"
        description="ДҚ-ны импорттау"
        onPress={hangleImportSQLite}
      />
      <SettingsItem
        iconName="file.upload"
        title="Экспорттау"
        description="Категорияны таңдап, бөлісу"
        onPress={() => {}}
      />
      <SettingsItem
        iconName="file.download"
        title="Импорттау"
        description="JSON файлдан деректерді жүктеу"
        onPress={handleImport}
      />

      <SectionHeader
        iconName="settings"
        text="Жалпы баптаулар"
        style={styles.sectionHeader}
      />
      <SettingsItem
        iconName="play.circle.fill"
        title="Интерфейс тілі"
        description="Қазақ тілі"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },
  sectionHeader: {
    marginTop: 10,
  },
});
