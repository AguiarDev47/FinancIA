import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Wallet, ArrowUpCircle, ArrowDownCircle, BarChart2, Minus, Plus, Target, FileText } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function DashboardScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#3B82F6" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Saldo Total:</Text>
            <Text style={styles.headerValue}>R$ 0,00</Text>
            <Text style={styles.headerMonth}>Novembro de 2025</Text>
          </View>

          <View style={styles.headerIcon}>
            <Wallet size={36} color="#30f100ff" />
          </View>
        </View>

        {/* CARDS ENTRADAS / SAIDAS */}
        <View style={styles.row}>
          {/* Entradas */}
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, justifyContent: "space-between" }}>
              <Text style={styles.cardTitle}>Entradas </Text>
              <ArrowUpCircle size={20} color="#22c55e" />
            </View>
            <Text style={[styles.cardValue, { color: "#22c55e" }]}>R$ 0,00</Text>
          </View>

          {/* Saídas */}
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, justifyContent: "space-between" }}>
              <Text style={styles.cardTitle}>Saídas</Text>
              <ArrowDownCircle size={20} color="#ef4444" />
            </View>
            <Text style={[styles.cardValue, { color: "#ef4444" }]}>R$ 0,00</Text>
          </View>
        </View>

        {/* GRÁFICO (mock visual) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fluxo Mensal</Text>
            <BarChart2 size={20} color="#555" />
          </View>

          <View style={styles.chartRow}>
            <View style={styles.chartBar}></View>
            <View style={[styles.chartBar, { height: 120 }]}></View>
          </View>

          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>jun</Text>
            <Text style={styles.chartLabel}>jul</Text>
            <Text style={styles.chartLabel}>ago</Text>
            <Text style={styles.chartLabel}>set</Text>
            <Text style={styles.chartLabel}>out</Text>
            <Text style={styles.chartLabel}>nov</Text>
          </View>
        </View>

        {/* AÇÕES RÁPIDAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>

          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={[styles.quickAction]} onPress={() => navigation.navigate("Transacoes")}>
              <View style={[styles.boxIcon, { backgroundColor: "#EEF2FF" }]}>
                <Minus color="#4F46E5" />
              </View>
              <Text style={styles.quickLabel}>Despesa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.boxIcon, { backgroundColor: "#ECFDF5" }]}>
                <Plus color="#22C55E" />
              </View>
              <Text style={styles.quickLabel}>Receita</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.boxIcon, { backgroundColor: "#F5F3FF" }]}>
                <Target color="#7C3AED" />
              </View>
              <Text style={styles.quickLabel}>Objetivo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.boxIcon, { backgroundColor: "#FFF7ED" }]}>
                <FileText color="#F97316" />
              </View>
              <Text style={styles.quickLabel}>Extrato</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* INSIGHTS DA IA */}
        <View style={styles.sectionIA}>
          <View style={styles.insightHeader}>
            <Text style={styles.sectionTitle}>Insights da IA</Text>
            <View style={styles.badgeNew}>
              <Text style={styles.badgeText}>NOVO</Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>✨</Text>
            <Text style={styles.insightText}>
              Parabéns! Você reduziu seus gastos em 100% este mês.
            </Text>
          </View>
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

  header: {
    backgroundColor: "#3B82F6",
    padding: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 200
  },

  headerTitle: {
    color: "#E0ECFF",
    fontSize: 14,
  },

  headerValue: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "700",
    marginTop: 4,
  },

  headerMonth: {
    color: "#E0ECFF",
    marginTop: 4,
  },

  headerIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 14,
    borderRadius: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: -30,
  },

  card: {
    backgroundColor: "#FFF",
    width: "48%",
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 16,
    elevation: 3,
  },

  cardTitle: {
    color: "#555",
    marginBottom: 6,
  },

  cardValue: {
    fontSize: 22,
    fontWeight: "700",
  },

  section: {
    backgroundColor: "#FFF",
    marginTop: 18,
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 16,
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 20
  },

  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 20,
    height: 130,
    marginBottom: 10,
    justifyContent: "flex-start",
  },

  chartBar: {
    width: 24,
    height: 80,
    backgroundColor: "#3B82F6",
    borderRadius: 6,
  },

  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  chartLabel: {
    color: "#555",
    fontSize: 12,
  },

  actionButton: {
    marginTop: 12,
    backgroundColor: "#F0F4FF",
    paddingVertical: 14,
    borderRadius: 10,
  },

  actionButtonText: {
    textAlign: "center",
    color: "#3B82F6",
    fontSize: 15,
    fontWeight: "600",
  },

  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  quickAction: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  boxIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  quickIcon: {
    fontSize: 22,
    fontWeight: "700",
  },

  quickLabel: {
    fontSize: 12,
    marginTop: 6,
    color: "#444",
    textAlign: "center",
  },

  /* INSIGHTS */
  sectionIA: {
    marginTop: 18,
    marginHorizontal: 20,
  },

  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },

  badgeNew: {
    backgroundColor: "#E9D5FF",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 20
  },

  badgeText: {
    fontSize: 12,
    color: "#7E22CE",
    fontWeight: "600",
  },

  insightCard: {
    backgroundColor: "#F4EEFF",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  insightEmoji: {
    fontSize: 20,
  },

  insightText: {
    color: "#444",
    fontSize: 14,
    flex: 1,
  },
});
