import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CheckCircle2, Download, FileText, CalendarDays, ChevronDown } from "lucide-react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { downloadExport, getExportSummary } from "../services/export";

export default function ExportDataScreen({ navigation }: any) {
  const [periodo, setPeriodo] = useState("Todos os Dados");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ transacoes: 0, objetivos: 0 });

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    try {
      const data = await getExportSummary();
      setStats({
        transacoes: data.transacoes || 0,
        objetivos: data.objetivos || 0,
      });
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Nao foi possivel carregar");
    }
  }

  async function handleExport(format: "csv" | "json") {
    try {
      setLoading(true);
      const result = await downloadExport(format);
      const ext = format === "csv" ? "csv" : "json";
      const filename = `financia-export-${Date.now()}.${ext}`;
      const uri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(uri, result.text, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Exportacao", "Arquivo gerado em: " + uri);
      }
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Nao foi possivel exportar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Exportar Dados</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <CheckCircle2 size={18} color="#3B82F6" />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Seus dados, suas regras</Text>
              <Text style={styles.infoSubtitle}>
                Exporte todas as suas informacoes financeiras para backup ou migracao.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Periodo</Text>
          <TouchableOpacity style={styles.selectBox} activeOpacity={0.8}>
            <View style={styles.selectLeft}>
              <CalendarDays size={18} color="#3B82F6" />
              <Text style={styles.selectText}>{periodo}</Text>
            </View>
            <ChevronDown size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#DBEAFE" }]}>
                <FileText size={18} color="#3B82F6" />
              </View>
              <Text style={styles.statLabel}>Transacoes</Text>
              <Text style={styles.statValue}>{stats.transacoes}</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#F3E8FF" }]}>
                <FileText size={18} color="#8B5CF6" />
              </View>
              <Text style={styles.statLabel}>Objetivos</Text>
              <Text style={styles.statValue}>{stats.objetivos}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleExport("csv")}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Download size={18} color="#111827" />
                <Text style={styles.secondaryText}>Exportar como CSV</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => handleExport("json")}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Download size={18} color="#FFF" />
                <Text style={styles.primaryText}>Exportar como JSON</Text>
              </>
            )}
          </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF4FF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#D6E4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  infoSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 10,
  },
  selectBox: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  selectLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectText: {
    fontSize: 14,
    color: "#111827",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
    elevation: 2,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 6,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#3B82F6",
    borderRadius: 16,
    paddingVertical: 14,
  },
  primaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
});
