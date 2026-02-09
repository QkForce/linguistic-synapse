import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryItem } from "@/components/items/CategoryItem";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Category, categoryService } from "@/services/categoryService";

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const data = categoryService.getAllCategories();
    setCategories(data);
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: colors.title, textShadowColor: colors.titleShadow },
          ]}
        >
          Менің курстарым
        </Text>
        <Text style={[styles.subtitle, { color: colors.description }]}>
          Барлық категориялар
        </Text>
      </View>

      {/* Search Bar */}
      <View></View>

      {/* Content Area */}
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryItem
            title={item.title || "no title"}
            // onPress={() => router.push(`/modules/${item.id}/`)}
            totalSentences={item.totalSentences || 0}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={styles.listContainer}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "black",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 96,
  },
  listContentContainer: {
    gap: 12,
  },
});
