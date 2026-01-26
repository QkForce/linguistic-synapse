import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Button } from "@/components/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";

type MonthYearPickerModalProps = {
  visible: boolean;
  initialMonth: number;
  initialYear: number;
  onClose: () => void;
  onApply: (month: number, year: number) => void;
};

export const MonthYearPickerModal = ({
  visible,
  initialMonth,
  initialYear,
  onClose,
  onApply,
}: MonthYearPickerModalProps) => {
  const [tempMonth, setTempMonth] = useState(initialMonth);
  const [tempYear, setTempYear] = useState(initialYear);
  const colors = useThemeColor();

  const MONTHS = [
    "Қаң",
    "Ақп",
    "Нау",
    "Сәу",
    "Мам",
    "Мау",
    "Шіл",
    "Там",
    "Қыр",
    "Қаз",
    "Қар",
    "Жел",
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.itemGlass,
              borderColor: colors.itemBorder,
            },
          ]}
        >
          {/* Year Stepper Selector */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setTempYear((y) => y - 1)}>
              <IconSymbol name="chevron.left" size={28} color={colors.title} />
            </TouchableOpacity>
            <Text style={[styles.yearText, { color: colors.title }]}>
              {tempYear}
            </Text>
            <TouchableOpacity onPress={() => setTempYear((y) => y + 1)}>
              <IconSymbol name="chevron.right" size={28} color={colors.title} />
            </TouchableOpacity>
          </View>

          {/* Month Grid */}
          <View style={styles.grid}>
            {MONTHS.map((m, i) => (
              <TouchableOpacity
                key={m}
                onPress={() => setTempMonth(i)}
                style={[
                  styles.monthItem,
                  tempMonth === i && { backgroundColor: colors.itemInnerGlass },
                ]}
              >
                <Text
                  style={{
                    color: tempMonth === i ? colors.text : colors.label,
                    fontWeight: "600",
                  }}
                  children={m}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Button */}
          <View style={styles.footer}>
            <Button
              variant="ghost"
              title="Жабу"
              onPress={onClose}
              style={styles.btn}
            />
            <Button
              variant="primary"
              title="Қолдану"
              onPress={() => onApply(tempMonth, tempYear)}
              style={styles.btn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  yearText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  monthItem: {
    width: "30%",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 5,
  },
  btn: {
    flex: 1,
    height: 45,
    fontSize: 12,
  },
});
