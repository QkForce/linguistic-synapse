import * as DocumentPicker from "expo-document-picker";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheet from "@gorhom/bottom-sheet";

import { SettingsItem } from "@/components/items/SettingsItem";
import { CategoryExportSheet } from "@/components/modals/CategoryExportSheet";
import { SectionHeader } from "@/components/SectionHeader";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Category, categoryService } from "@/services/categoryService";
import { dataTransferService } from "@/services/dataTransferService";
import { importSQLiteFile } from "@/utils/sqliteUtils";

export default function DatabaseScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (categories.length > 0) {
      sheetRef.current?.expand();
      // sheetRef.current?.snapToIndex(0);
    }
  }, [categories]);

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

  const handleExportPress = () => {
    const data = categoryService.getAllCategories();
    setCategories(data);
  };

  const onCategorySelect = async (id: number, title: string) => {
    sheetRef.current?.close();
    let fileName = title.replaceAll(/\s/g, "_");
    fileName = fileName.replaceAll(/[^a-zA-Z0-9_-]/g, "");
    fileName = fileName.replaceAll(/_{2,}/g, "_");
    await dataTransferService.exportCategory(id, `${fileName}.json`);
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
        onPress={handleExportPress}
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

      <CategoryExportSheet
        ref={sheetRef}
        categories={categories}
        onSelect={onCategorySelect}
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
