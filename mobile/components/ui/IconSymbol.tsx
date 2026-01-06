// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

export type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;
export type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "settings": "settings",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "pencil": "edit",
  "speaker.3": "surround-sound",
  "arrow.forward": "arrow-forward",
  "arrow.backward": "arrow-back",
  "remove": "remove",
  "add": "add",
  "play.circle": "play-circle",
  "pause.circle": "pause-circle",
  "play": "play-arrow",
  "pause": "pause",
  "stop": "stop",
  "play.circle.fill": "play-circle-filled",
  "file.download": "file-download",
  "checkmark.circle": "check-circle",
  "timer": "timer",
  "spinner": "autorenew",
  "check": "check",
  "times": "close",
  "save": "save",
  "trash": "delete",
  "trash-2": "delete",
  "error": "error",
  "success": "check-circle",
  "loading": "autorenew",
  "close": "close",
  "replay": "replay",
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
