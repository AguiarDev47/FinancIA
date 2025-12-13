import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Plus, Plane, Heart } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

export default function ObjetivosScreen() {
  type Nav = NativeStackNavigationProp<RootStackParamList, "Transacoes">;
  const navigation = useNavigation<Nav>();

  const objetivos = [
    {
      id: 1,
      nome: "Viagem para Europa",
      dataLimite: "19 de dez de 2025",
      economizado: 3500,
      meta: 15000,
      icon: <Plane size={26} color="#FFF" />,
      color: "#A78BFA", // lilás
    },
    {
      id: 2,
      nome: "Reserva de Emergência",
      dataLimite: "29 de jun de 2025",
      economizado: 5200,
      meta: 10000,
      icon: <Heart size={26} color="#FFF" />,
      color: "#A78BFA",
    },
  ];

  function percentual(obj: any) {
    return Math.round((obj.economizado / obj.meta) * 100);
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Meus Objetivos</Text>
            <Text style={styles.subtitle}>{objetivos.length} objetivos cadastrados</Text>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("ObjetivoForm")}>
            <Plus size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* LISTA DE OBJETIVOS */}
          {objetivos.map((obj) => (
            <View key={obj.id} style={styles.card}>

              {/* Cabeçalho do card */}
              <View style={styles.cardHeader}>
                <LinearGradient
                  colors={["#3B82F6", "rgba(220, 68, 240, 1)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconBox}
                >
                  {obj.icon}
                </LinearGradient>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitle}>{obj.nome}</Text>
                  <Text style={styles.cardDate}>até {obj.dataLimite}</Text>
                </View>

                <Text style={styles.percentText}>{percentual(obj)}%</Text>
              </View>

              {/* PROGRESSO */}
              <Text style={styles.progressLabel}>Progresso</Text>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${percentual(obj)}%`,
                      backgroundColor: obj.color,
                    },
                  ]}
                />
              </View>

              {/* VALORES */}
              <View style={styles.valuesRow}>
                <View>
                  <Text style={styles.valueLabel}>Economizado</Text>
                  <Text style={styles.valueMoney}>R$ {obj.economizado.toLocaleString("pt-BR")},00</Text>
                </View>

                <View>
                  <Text style={styles.valueLabel}>Faltam</Text>
                  <Text style={styles.valueMoney}>
                    R$ {(obj.meta - obj.economizado).toLocaleString("pt-BR")},00
                  </Text>
                </View>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    height: 120
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
  },

  addButton: {
    backgroundColor: "#3B82F6",
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  cardDate: {
    fontSize: 14,
    color: "#666",
  },

  percentText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3B82F6",
  },

  progressLabel: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },

  progressBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginTop: 6,
  },

  progressFill: {
    height: 8,
    borderRadius: 6,
  },

  valuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  valueLabel: {
    fontSize: 13,
    color: "#777",
  },

  valueMoney: {
    fontSize: 16,
    fontWeight: "700",
  },
});
