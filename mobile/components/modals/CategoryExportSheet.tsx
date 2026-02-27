import React, { useCallback, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Category } from "@/services/categoryService";
import { CategoryExportItem } from "../items/CategoryExportItem";

interface Props {
  categories: Category[];
  onSelect: (id: number, title: string) => void;
}

export const CategoryExportSheet = React.forwardRef<BottomSheet, Props>(
  ({ categories, onSelect }, ref) => {
    const colors = useThemeColor();

    // Sheet-тің тоқтайтын биіктіктері (пайызбен немесе санмен)
    const snapPoints = useMemo(() => ["50%", "80%"], []);

    // Фонды күңгірттеу (backdrop)
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1} // It's closed at first.
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.title }}
      >
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Экспорттау үшін категорияны таңдаңыз
          </Text>

          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CategoryExportItem
                key={item.id}
                title={item.title}
                totalSentences={item.totalSentences}
                onPress={() => onSelect(item.id, item.title)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  itemText: {
    marginLeft: 15,
    fontSize: 16,
  },
});
