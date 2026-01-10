import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

export default function LoginScreen() {
  const { signIn, verifyTwoFactor } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [twoFactorTokenId, setTwoFactorTokenId] = useState<string | null>(
    null
  );
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorEmail, setTwoFactorEmail] = useState("");
  const [loading, setLoading] = useState(false);

  type Nav = NativeStackNavigationProp<RootStackParamList, "Login">;
  const navigation = useNavigation<Nav>();

  function formatError(err: any) {
    if (!err) return "Erro desconhecido";
    if (typeof err === "string") return err;
    const details = [
      err.name ? `name: ${err.name}` : null,
      err.message ? `message: ${err.message}` : null,
      err.code ? `code: ${err.code}` : null,
      err.status ? `status: ${err.status}` : null,
    ].filter(Boolean);

    let extra = "";
    try {
      extra = JSON.stringify(err);
    } catch {
      extra = String(err);
    }

    const lines = [
      details.length ? details.join("\n") : null,
      extra && extra !== "{}" ? `raw: ${extra}` : null,
      err.stack ? `stack: ${err.stack}` : null,
    ].filter(Boolean);

    return lines.join("\n");
  }

  async function handleLogin() {
    try {
      setLoading(true);
      const result = await signIn(email, senha);
      if (result?.requiresTwoFactor) {
        setTwoFactorTokenId(result.twoFactorTokenId || null);
        setTwoFactorEmail(result.email || "");
      }
    } catch (err: any) {
      Alert.alert("Erro", formatError(err) || "Nao foi possivel entrar");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyTwoFactor() {
    if (!twoFactorTokenId) return;
    try {
      setLoading(true);
      await verifyTwoFactor(twoFactorTokenId, twoFactorCode);
      setTwoFactorCode("");
      setTwoFactorTokenId(null);
      setTwoFactorEmail("");
    } catch (err: any) {
      Alert.alert("Erro", formatError(err) || "Codigo invalido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      <Text style={styles.subtitle}>
        O app que vai te ajudar a ter um controle maior sobre sua gestao
        financeira.
      </Text>

      <Text style={styles.title}>
        {twoFactorTokenId ? "Confirmar codigo" : "Login"}
      </Text>

      {!twoFactorTokenId && (
        <TextInput
          style={styles.input}
          placeholder="Seu Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      )}

      {!twoFactorTokenId && (
        <TextInput
          style={styles.input}
          placeholder="Sua Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
      )}

      {twoFactorTokenId && (
        <>
          <Text style={styles.twoFactorHint}>
            Enviamos um codigo para {twoFactorEmail || "seu email"}.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Codigo de 6 digitos"
            keyboardType="numeric"
            value={twoFactorCode}
            onChangeText={setTwoFactorCode}
          />
        </>
      )}

      <TouchableOpacity
        style={{ width: "100%" }}
        onPress={twoFactorTokenId ? handleVerifyTwoFactor : handleLogin}
      >
        <LinearGradient
          colors={["#45C58C", "#3D7DFF"]}
          style={styles.buttonPrimary}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonPrimaryText}>
              {twoFactorTokenId ? "Confirmar" : "Acessar"}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {!twoFactorTokenId && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text>Ainda nao tem conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "#3D7DFF", fontWeight: "600" }}>
              Clique aqui
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
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
    fontWeight: "600",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
  },

  twoFactorHint: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
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
});
