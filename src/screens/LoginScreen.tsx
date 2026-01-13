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
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { requestPasswordReset, resetPassword } from "../services/auth";
import { getErrorMessage } from "../utils/errors";

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
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetTokenId, setResetTokenId] = useState<string | null>(null);
  const [resetCode, setResetCode] = useState("");
  const [resetSenha, setResetSenha] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");

  type Nav = NativeStackNavigationProp<RootStackParamList, "Login">;
  const navigation = useNavigation<Nav>();

  async function handleLogin() {
    try {
      setLoading(true);
      const result = await signIn(email, senha);
      if (result?.requiresTwoFactor) {
        setTwoFactorTokenId(result.twoFactorTokenId || null);
        setTwoFactorEmail(result.email || "");
      }
    } catch (err: any) {
      Alert.alert("Erro", getErrorMessage(err, "Nao foi possivel entrar."));
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
      Alert.alert("Erro", getErrorMessage(err, "Codigo invalido."));
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestReset() {
    if (!resetEmail) {
      Alert.alert("Erro", "Informe o e-mail.");
      return;
    }
    try {
      setLoading(true);
      const result = await requestPasswordReset(resetEmail);
      if (!result?.tokenId) {
        Alert.alert(
          "Redefinicao",
          "Se o e-mail existir, enviamos um codigo."
        );
        return;
      }
      setResetTokenId(result.tokenId);
      Alert.alert(
        "Redefinicao",
        `Enviamos um codigo para ${result.email || "seu email"}.`
      );
    } catch (err: any) {
      Alert.alert("Erro", getErrorMessage(err, "Nao foi possivel enviar."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!resetTokenId) return;
    if (!resetCode || !resetSenha) {
      Alert.alert("Erro", "Preencha codigo e nova senha.");
      return;
    }
    if (resetSenha !== resetConfirm) {
      Alert.alert("Erro", "As senhas nao conferem.");
      return;
    }
    try {
      setLoading(true);
      await resetPassword(resetTokenId, resetCode, resetSenha);
      Alert.alert("Senha atualizada", "Entre com a nova senha.");
      setResetModalVisible(false);
      setResetTokenId(null);
      setResetCode("");
      setResetSenha("");
      setResetConfirm("");
    } catch (err: any) {
      Alert.alert(
        "Erro",
        getErrorMessage(err, "Nao foi possivel redefinir.")
      );
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

      {!twoFactorTokenId && (
        <TouchableOpacity onPress={() => setResetModalVisible(true)}>
          <Text style={styles.forgotText}>Esqueci a senha</Text>
        </TouchableOpacity>
      )}

      <Modal visible={resetModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Redefinir senha</Text>

            {!resetTokenId ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Seu Email"
                  autoCapitalize="none"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                />
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleRequestReset}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.modalButtonText}>Enviar codigo</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Codigo de 6 digitos"
                  keyboardType="numeric"
                  value={resetCode}
                  onChangeText={setResetCode}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nova senha"
                  secureTextEntry
                  value={resetSenha}
                  onChangeText={setResetSenha}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar nova senha"
                  secureTextEntry
                  value={resetConfirm}
                  onChangeText={setResetConfirm}
                />
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleResetPassword}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.modalButtonText}>Salvar</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={() => {
                setResetModalVisible(false);
                setResetTokenId(null);
                setResetCode("");
                setResetSenha("");
                setResetConfirm("");
              }}
            >
              <Text style={styles.modalCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  forgotText: {
    marginTop: 10,
    color: "#3D7DFF",
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#3D7DFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  modalCancel: {
    marginTop: 12,
    textAlign: "center",
    color: "#6B7280",
  },
});
