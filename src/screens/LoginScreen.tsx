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
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      <Text style={styles.subtitle}>
        O app que vai te ajudar a ter um controle maior sobre sua gestão
        financeira.
      </Text>

      <Text style={styles.title}>Login</Text>

      {/* INPUTS */}
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

      {/* BOTÃO */}
      <TouchableOpacity onPress={() => navigation.navigate("Dashboard")} style={{ width: "100%" }}>
        <LinearGradient
          colors={["#45C58C", "#3D7DFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonPrimary}
        >
          <Text style={styles.buttonPrimaryText}>Acessar</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* LINKS */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>
          Ainda não possui cadastro? <Text style={styles.linkBlue}>Clique aqui</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.linkMuted}>Esqueceu a senha?</Text>
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

  link: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 14,
    color: "#444",
  },

  linkBlue: {
    color: "#2563EB",
    fontWeight: "600",
  },

  linkMuted: {
    marginTop: 10,
    fontSize: 13,
    color: "#777",
  },
});
