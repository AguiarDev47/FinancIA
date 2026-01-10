import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface BarDatum {
  receita: number;
  despesa: number;
  label?: string;
}

interface BarChartProps {
  data: BarDatum[];
  height?: number;
}

export default function BarChart({ data, height = 140 }: BarChartProps) {
  const safeData = data.filter(
    (item) => Number.isFinite(item.receita) && Number.isFinite(item.despesa)
  );

  if (safeData.length === 0) {
    return <Text style={styles.emptyText}>Sem dados para o periodo</Text>;
  }

  const padding = 8;
  const barWidth = 12;
  const barGap = 6;
  const groupWidth = 56;
  const maxValue = Math.max(
    1,
    ...safeData.flatMap((item) => [item.receita, item.despesa])
  );
  const barAreaHeight = height - padding * 2;

  const scaleHeight = (value: number) =>
    (Math.max(0, value) / maxValue) * barAreaHeight;

  return (
    <View style={styles.container}>
      <View style={[styles.row, { height }]}>
        {safeData.map((item, index) => {
          const receitaHeight = Math.max(2, scaleHeight(item.receita));
          const despesaHeight = Math.max(2, scaleHeight(item.despesa));
          const leftOffset = (groupWidth - (barWidth * 2 + barGap)) / 2;
          const isLast = index === safeData.length - 1;

          return (
            <View
              key={`${item.label ?? "bar"}-${index}`}
              style={[styles.barWrap, !isLast && styles.barGap]}
            >
              <View style={[styles.barArea, { height, width: groupWidth }]}>
                <View
                  style={[
                    styles.bar,
                    styles.barReceita,
                    {
                      height: receitaHeight,
                      width: barWidth,
                      left: leftOffset,
                      bottom: padding,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.bar,
                    styles.barDespesa,
                    {
                      height: despesaHeight,
                      width: barWidth,
                      left: leftOffset + barWidth + barGap,
                      bottom: padding,
                    },
                  ]}
                />
              </View>
              {!!item.label && <Text style={styles.label}>{item.label}</Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  barWrap: {
    width: 56,
    alignItems: "center",
  },
  barGap: {
    marginRight: 10,
  },
  barArea: {
    position: "relative",
  },
  bar: {
    position: "absolute",
    borderRadius: 4,
  },
  barReceita: {
    backgroundColor: "#22C55E",
  },
  barDespesa: {
    backgroundColor: "#EF4444",
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
  },
});
