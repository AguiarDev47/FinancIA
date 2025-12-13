import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { User, ChevronRight, Bell, ShieldCheck, Settings, Download, LogOut } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfigScreen() {
  const usuario = {
    nome: "Aguiar Programação",
    email: "programacaoaguiar@gmail.com",
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>

        <View style={{ backgroundColor: "#FFF", paddingHorizontal: 20, height: 90, marginBottom: 20 }}>
          <Text style={styles.title}>Configurações</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <User size={28} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{usuario.nome}</Text>
              <Text style={styles.userEmail}>{usuario.email}</Text>
            </View>
          </View>

          {/* SEÇÃO: CONTA */}
          <Text style={styles.sectionTitle}>CONTA</Text>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <User size={20} color="#3B82F6" />
              <Text style={styles.itemText}>Perfil</Text>
            </View>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <ShieldCheck size={20} color="#3B82F6" />
              <Text style={styles.itemText}>Segurança</Text>
            </View>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>

          {/* SEÇÃO: PREFERÊNCIAS */}
          <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Bell size={20} color="#3B82F6" />
              <Text style={styles.itemText}>Notificações</Text>
            </View>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Download size={20} color="#3B82F6" />
              <Text style={styles.itemText}>Exportar Dados</Text>
            </View>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logOut}>
            <LogOut size={17} color={"red"} />
            <Text style={styles.logOutText}>Sair da Conta</Text>
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

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 20,
  },

  /* CARD DO USUÁRIO */
  userCard: {
    flexDirection: "row",
    backgroundColor: "#3B82F6",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    backgroundColor: "#2563EB",
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  userName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },

  userEmail: {
    color: "#E0E7FF",
    fontSize: 14,
  },

  /* TÍTULOS DAS SEÇÕES */
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginBottom: 8,
    marginTop: 10,
  },

  /* ITENS */
  item: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },

  logOut: {
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 15,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 12,
    padding: 15,
    marginTop: 15
  },
  logOutText: {
    color: "red",
    fontWeight: 600,
    fontSize: 16
  }
});
