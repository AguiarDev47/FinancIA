import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Dimensions } from "react-native";
import DonutChart from "../components/DonutChart";
import { categoriasData } from "../data/data";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function GraficosScreen() {
  const [filter, setFilter] = useState("todos");

  const categorias = categoriasData.map((c) => ({
    ...c,
    valor: 200,
    percentual: 10,
  }));

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ backgroundColor: "#FFF", paddingHorizontal: 20., paddingBottom: 20 }}>
          <Text style={styles.title}>Categorias</Text>

          {/* FILTROS */}
          <View style={styles.filterContainer}>
            {["mes", "3meses", "todos"].map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[styles.filterButton, filter === tipo && styles.filterActive]}
                onPress={() => setFilter(tipo)}
              >
                <Text style={[styles.filterText, filter === tipo && styles.filterTextActive]}>
                  {tipo === "mes" && "Mês Atual"}
                  {tipo === "3meses" && "3 Meses"}
                  {tipo === "todos" && "Todos"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* --- DONUT CHART --- */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribuição de Gastos</Text>

            <DonutChart
              data={categorias.map((c) => ({
                value: c.valor,
                color: c.color,
              }))}
            />
          </View>

          {/* LISTA DE CATEGORIAS */}
          {categorias.map((c, i) => (
            <View style={styles.categoryCard} key={i}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={[styles.dot, { backgroundColor: c.color }]} />
                <Text style={styles.categoryLabel}>{c.label}</Text>
              </View>

              <View>
                <Text style={styles.categoryValue}>R$ {c.valor},00</Text>
                <Text style={styles.categoryPercent}>{c.percentual}%</Text>
              </View>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${c.percentual}%`, backgroundColor: c.color },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 16,
  },

  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EEE",
    padding: 6,
    borderRadius: 14,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  filterActive: {
    backgroundColor: "#FFF",
  },

  filterText: {
    color: "#444",
    fontSize: 14,
  },

  filterTextActive: {
    color: "#000",
    fontWeight: "700",
  },

  chartCard: {
    backgroundColor: "#FFF",
    marginTop: 18,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },

  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },

  categoryCard: {
    backgroundColor: "#FFF",
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },

  categoryLabel: {
    fontSize: 16,
    fontWeight: "600",
  },

  categoryValue: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right",
  },

  categoryPercent: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },

  progressBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginTop: 10,
  },

  progressFill: {
    height: 6,
    borderRadius: 6,
  },
});
