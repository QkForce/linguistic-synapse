import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackgroundSVG } from "@/components/BackgroundSVG";
import { ParallaxFlatList } from "@/components/ParallaxFlatList";
import { LessonItem } from "@/components/items/LessonItem";
import { lessons } from "@/data/lessons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ModuleDetailsScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const insets = useSafeAreaInsets();
  const { moduleId } = useLocalSearchParams();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Lesson ${moduleId}`,
      onPressHeaderRight: () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          console.warn("No previous screen to go back to.");
        }
      },
    });
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <BackgroundSVG />
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <ParallaxFlatList
          title="Lessons"
          data={lessons}
          renderItem={({ item }) => (
            <LessonItem
              title={item.title}
              completed={item.completed}
              onPress={() => {}}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          style={styles.listContainer}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
});
