import React, { useState, useEffect, useCallback } from "react";
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { listarTransacoes } from "../services/transacoes";

export default function TransacoesScreen() {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  async function carregar() {
    try {
      setLoading(true);
      const data = await listarTransacoes();
      setTransacoes(data);
    } catch (e) {
      console.error("Erro ao carregar transações", e);
    } finally {
      setLoading(false);
    }
  }

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

          {transacoes.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.transactionCard}
              onPress={() =>
                navigation.navigate("TransacaoDetalhe", { id: item.id })
              }
            >
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor:
                      item.tipo === "despesa" ? "#FEE2E2" : "#DCFCE7",
                  },
                ]}
              >
                {item.tipo === "despesa" ? (
                  <ShoppingBag size={20} color="#EF4444" />
                ) : (
                  <Briefcase size={20} color="#22C55E" />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.transactionName}>
                  {item.descricao || item.categoria?.nome}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(item.data).toLocaleDateString("pt-BR")}
                </Text>
              </View>

              <Text
                style={[
                  styles.transactionValue,
                  { color: item.tipo === "despesa" ? "#EF4444" : "#22C55E" },
                ]}
              >
                {item.tipo === "despesa" ? "-" : "+"} R$ {item.valor.toFixed(2)}
              </Text>
            </TouchableOpacity>
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
