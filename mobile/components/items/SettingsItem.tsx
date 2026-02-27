import { Pressable, StyleSheet, Text, View } from "react-native";

import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";

type SettingsItemProps = {
  iconName: IconSymbolName;
  title: string;
  description?: string;
  onPress: () => void;
};

export function SettingsItem({
  iconName,
  title,
  description,
  onPress,
}: SettingsItemProps) {
  const colors = useThemeColor();

  return (
    <Pressable
      style={[
        styles.container,
        { borderColor: colors.itemBorder, backgroundColor: colors.btnGlassBg },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          {
            borderColor: colors.itemBorder,
            backgroundColor: colors.itemInnerGlass,
          },
        ]}
      >
        <IconSymbol name={iconName} size={24} color={colors.itemBorder} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} children={title} />
        <Text
          style={[styles.description, { color: colors.description }]}
          children={description}
        />
      </View>
      <IconSymbol name="chevron.right" size={24} color={colors.label} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
  },
  description: {
    fontSize: 10,
  },
});
