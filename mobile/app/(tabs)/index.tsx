import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackgroundSVG } from "@/components/BackgroundSVG";
import { ParallaxFlatList } from "@/components/ParallaxFlatList";
import { ModuleItem } from "@/components/items/ModuleItem";
import { modules } from "@/data/modules";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ModulesScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <BackgroundSVG />
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <ParallaxFlatList
          title="Linguistic Synapse"
          data={modules}
          renderItem={({ item }) => (
            <ModuleItem
              title={item.title}
              description={item.description}
              onPress={() => router.push(`/modules/${item.id}/`)}
              totalLessons={item.totalLessons}
              completedLessons={item.completedLessons}
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
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
});
