import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackgroundSVG } from "@/components/BackgroundSVG";
import { ParallaxFlatList } from "@/components/ParallaxFlatList";
import { ModuleItem } from "@/components/items/ModuleItem";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Module, moduleService } from "@/services/moduleService";
// import { modules } from "@/data/modules";

export default function ModulesScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const insets = useSafeAreaInsets();
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const data = moduleService.getAllModules();
    setModules(data);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <BackgroundSVG />
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <ParallaxFlatList
          title="Linguistic Synapse"
          data={modules}
          renderItem={({ item }) => (
            <ModuleItem
              title={item.title || "no title"}
              description={item.description || "no description"}
              onPress={() => router.push(`/modules/${item.id}/`)}
              totalLessons={item.totalLessons || 0}
              completedLessons={item.completedLessons || 0}
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
