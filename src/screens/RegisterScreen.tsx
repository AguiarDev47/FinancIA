import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";

export default function RegisterScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      <Text style={styles.subtitle}>
        O app que vai te ajudar a ter um controle maior sobre sua gestão
        financeira.
      </Text>

      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="Seu Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Sua Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.buttonPrimary}>
        <Text style={styles.buttonPrimaryText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft size={18} color="#444" />
        <Text style={styles.backText}>Voltar para o login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
  },

  logo: {
    width: 170,
    height: 170,
    resizeMode: "contain",
    marginBottom: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#444",
    width: "90%",
    marginBottom: 22,
    fontSize: 17,
    fontWeight: 600
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
  },

  input: {
    width: "100%",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  buttonPrimary: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 10,
  },

  buttonPrimaryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  backText: {
    marginLeft: 6,
    color: "#222",
    fontSize: 14,
  },
});
