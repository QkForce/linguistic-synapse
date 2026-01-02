import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
  Animated,
  FlatList,
  FlatListProps,
  StyleSheet,
  Text,
  View,
} from "react-native";

export const HEADER_HEIGHT = 120;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as <T>(
  props: FlatListProps<T> & { ref?: any }
) => React.JSX.Element;

interface ParallaxFlatListProps<T> extends FlatListProps<T> {
  title: string;
}

/**
 * Universal high-tech FlatList with parallax header
 */
export function ParallaxFlatList<T>({
  title,
  ...flatListProps
}: ParallaxFlatListProps<T>) {
  const colors = useThemeColor();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT / 2],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 5, HEADER_HEIGHT],
    outputRange: [1, 0.1, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={{ flex: 1 }}>
      {/* --- HEADER --- */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslate }],
            opacity: headerOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={[
            colors.background,
            colors.background,
            colors.background,
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={[styles.headerTitle, { color: colors.title }]}>
          {title}
        </Text>
      </Animated.View>

      {/* --- FlatList --- */}
      <AnimatedFlatList
        {...flatListProps}
        contentContainerStyle={[
          { paddingTop: HEADER_HEIGHT },
          flatListProps.contentContainerStyle,
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    textShadowColor: "rgba(0,255,255,0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    letterSpacing: 1,
    padding: 16,
  },
});
