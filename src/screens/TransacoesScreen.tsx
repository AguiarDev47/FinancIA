import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Plus, Search, ShoppingBag, Briefcase } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

export default function TransacoesScreen() {
  type Nav = NativeStackNavigationProp<RootStackParamList, "Transacoes">;
  const navigation = useNavigation<Nav>();

  const [filter, setFilter] = useState<"todas" | "receitas" | "despesas">(
    "todas"
  );

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 130 }}>
        {/* HEADER */}
        <View style={{ backgroundColor: "#FFF", paddingHorizontal: 20, paddingBottom: 15 }}>
          <View style={styles.header}>
            <Text style={styles.title}>Transações</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("NovaTransacao")}>
              <Plus size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* SEARCH */}
          <View style={styles.searchBox}>
            <Search size={18} color="#999" style={{ marginRight: 6 }} />
            <TextInput
              placeholder="Buscar transações..."
              style={{ flex: 1 }}
              placeholderTextColor="#AAA"
            />
          </View>

          {/* FILTER */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === "todas" && styles.filterActive,
              ]}
              onPress={() => setFilter("todas")}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === "todas" && styles.filterTextActive,
                ]}
              >
                Todas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === "receitas" && styles.filterActive,
              ]}
              onPress={() => setFilter("receitas")}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === "receitas" && styles.filterTextActive,
                ]}
              >
                Receitas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === "despesas" && styles.filterActive,
              ]}
              onPress={() => setFilter("despesas")}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === "despesas" && styles.filterTextActive,
                ]}
              >
                Despesas
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.monthTitle}>NOVEMBRO 2025</Text>

          {/* ITEM DESPESA */}
          <View style={styles.transactionCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#FEE2E2" }]}>
              <ShoppingBag size={20} color="#EF4444" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.transactionName}>Mercado</Text>
              <Text style={styles.transactionDate}>15 de Nov</Text>
            </View>

            <Text style={[styles.transactionValue, { color: "#EF4444" }]}>
              - R$ 250,00
            </Text>
          </View>

          {/* ITEM RECEITA */}
          <View style={styles.transactionCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#DCFCE7" }]}>
              <Briefcase size={20} color="#22C55E" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.transactionName}>Criação de Site</Text>
              <Text style={styles.transactionDate}>15 de Nov</Text>
            </View>

            <Text style={[styles.transactionValue, { color: "#22C55E" }]}>
              + R$ 500,00
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
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
  },

  addButton: {
    backgroundColor: "#3B82F6",
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  searchBox: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 12,
    gap: 10,
    backgroundColor: "#EEE",
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 8
  },

  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: "#EEE",
    borderRadius: 10,
  },

  filterActive: {
    backgroundColor: "#FFF",
  },

  filterText: {
    fontSize: 14,
    color: "#000",
  },

  filterTextActive: {
    color: "#000",
    fontWeight: "600",
  },

  monthTitle: {
    marginTop: 18,
    marginBottom: 10,
    color: "#6B7280",
    fontWeight: "700",
  },

  transactionCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  transactionName: {
    fontSize: 16,
    fontWeight: "600",
  },

  transactionDate: {
    fontSize: 13,
    color: "#6B7280",
  },

  transactionValue: {
    fontSize: 16,
    fontWeight: "700",
  },
});
