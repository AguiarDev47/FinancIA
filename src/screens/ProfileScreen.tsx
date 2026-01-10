import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Camera, User } from "lucide-react-native";
import { AuthContext } from "../contexts/AuthContext";

export default function ProfileScreen({ navigation }: any) {
  const { user, updateProfile } = useContext(AuthContext);
  const [nome, setNome] = useState(user?.nome ?? "");
  const [remuneracao, setRemuneracao] = useState(
    user?.remuneracao !== undefined ? String(user.remuneracao) : "0"
  );
  const email = user?.email ?? "";

  async function handleSalvar() {
    const valor = Number(remuneracao.replace(",", "."));
    if (Number.isNaN(valor)) {
      Alert.alert("Perfil", "Informe uma remuneracao valida.");
      return;
    }

    try {
      await updateProfile(nome, valor);
      Alert.alert("Perfil", "Alteracoes salvas.");
    } catch (err: any) {
      Alert.alert("Perfil", err.message || "Nao foi possivel salvar.");
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <User size={42} color="#FFF" />
          </View>
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            placeholder="Seu nome"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            value={email}
            editable={false}
            style={[styles.input, styles.inputDisabled]}
            placeholder="email@exemplo.com"
          />
          <Text style={styles.helper}>O e-mail nao pode ser alterado</Text>

          <Text style={styles.label}>Remuneracao Atual</Text>
          <TextInput
            value={remuneracao}
            onChangeText={setRemuneracao}
            style={styles.input}
            placeholder="Valor Fixo Mensal"
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
            <Text style={styles.saveText}>Salvar Alteracoes</Text>
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
  avatarWrap: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    position: "absolute",
    right: "38%",
    bottom: -6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  form: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  inputDisabled: {
    color: "#9CA3AF",
    backgroundColor: "#F9FAFB",
  },
  helper: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
