import React from "react";
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LogDetails } from "@/types/stat";
import { getScoreForTimeEfficiency } from "@/utils/scoring";
import { formatMsToTime } from "@/utils/time";

type InfoCardProps = {
  title: string;
  value: string;
  icon: IconSymbolName;
  valueColor: ColorValue;
  labelColor: ColorValue;
  bgColor: ColorValue;
  style?: StyleProp<ViewStyle>;
};

const InfoCard = ({
  title,
  value,
  icon,
  valueColor,
  labelColor,
  bgColor,
  style,
}: InfoCardProps) => {
  return (
    <View style={[styles.commonScoreCard, { backgroundColor: bgColor }, style]}>
      <View style={styles.commonScoreCardInnerRow}>
        <IconSymbol name={icon} size={16} color={valueColor} />
        <Text style={[styles.commonScoreText, { color: valueColor }]}>
          {value}
        </Text>
      </View>
      <Text style={[styles.commonScoreLabel, { color: labelColor }]}>
        {title}
      </Text>
    </View>
  );
};

export const StatsSummary = ({ state }: { state: LogDetails }) => {
  const colors = useThemeColor();
  const timeTimeEfficiencyScore = getScoreForTimeEfficiency(
    state.time_efficiency
  );

  const getTimeEfficiencyStyle = (): { scoreColor: ColorValue } => {
    if (timeTimeEfficiencyScore == "slow") return { scoreColor: colors.error };
    if (timeTimeEfficiencyScore == "cheating")
      return { scoreColor: colors.warning };
    if (timeTimeEfficiencyScore == "fast")
      return { scoreColor: colors.success };

    return {
      scoreColor: colors.success,
    };
  };

  const { scoreColor } = getTimeEfficiencyStyle();

  return (
    <View style={styles.container}>
      <View style={styles.commonScoresContainer}>
        <InfoCard
          title="Дәлдік"
          value={`${state.accuracy}%`}
          icon="target"
          valueColor={colors.title}
          labelColor={colors.text}
          bgColor={colors.itemGlass}
        />
        <InfoCard
          title="Сенімділік"
          value={`${state.confidence}%`}
          icon="chart"
          valueColor={colors.title}
          labelColor={colors.text}
          bgColor={colors.itemGlass}
        />
      </View>

      <View
        style={[
          styles.commonScoreCard,
          { backgroundColor: colors.itemGlass, marginTop: 16, width: "100%" },
        ]}
      >
        <View style={styles.commonScoreCardInnerRow}>
          <Text
            style={[
              styles.commonScoreLabel,
              { color: colors.title, lineHeight: 14 },
            ]}
          >
            <IconSymbol name="access-time" size={14} color={colors.title} />
            {" Уақытты қолдану тиімділігі:"}
          </Text>
          <Text style={[styles.commonScoreText, { color: scoreColor }]}>
            {`${state.time_efficiency}%`}
          </Text>
        </View>

        <View style={styles.commonScoreCardInnerRow}>
          <Text style={[styles.commonScoreLabel, { color: colors.title }]}>
            <IconSymbol name="error" size={14} color={colors.title} />
            {" Уақыт балансы:"}
          </Text>
          <Text style={[styles.commonScoreText, { color: scoreColor }]}>
            {formatMsToTime(state.time_overuse_ms)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: "100%",
  },
  commonScoresContainer: {
    flexDirection: "row",
    gap: 12,
  },
  commonScoreCard: {
    flex: 1,
    padding: 16,
    borderRadius: 30,
    justifyContent: "center",
  },
  commonScoreCardInnerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commonScoreText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  commonScoreLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
