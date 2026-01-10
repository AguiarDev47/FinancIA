import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  Fingerprint,
  Key,
  ChevronRight,
  X,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import {
  changePassword,
  confirmTwoFactor,
  disableTwoFactor,
  getSecurityStatus,
  listSessions,
  requestTwoFactor,
  revokeOtherSessions,
  revokeSession,
} from "../services/security";

export default function SecurityScreen({ navigation }: any) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorTokenId, setTwoFactorTokenId] = useState<string | null>(
    null
  );
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorModalVisible, setTwoFactorModalVisible] = useState(false);
  const [disableTwoFactorVisible, setDisableTwoFactorVisible] =
    useState(false);
  const [disablePassword, setDisablePassword] = useState("");

  const [biometria, setBiometria] = useState(false);

  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const [sessionsVisible, setSessionsVisible] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSecurity();
  }, []);

  async function loadSecurity() {
    try {
      const status = await getSecurityStatus();
      setTwoFactorEnabled(!!status.twoFactorEnabled);
      const biometriaStorage = await AsyncStorage.getItem(
        "@biometriaEnabled"
      );
      setBiometria(biometriaStorage === "true");
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Nao foi possivel carregar");
    }
  }

  async function handleToggleTwoFactor() {
    if (twoFactorEnabled) {
      setDisableTwoFactorVisible(true);
      return;
    }

    try {
      setLoading(true);
      const result = await requestTwoFactor();
      setTwoFactorTokenId(result.tokenId);
      setTwoFactorModalVisible(true);
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Nao foi possivel ativar");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmTwoFactor() {
    if (!twoFactorTokenId) return;
    try {
      setLoading(true);
      await confirmTwoFactor(twoFactorTokenId, twoFactorCode);
      setTwoFactorEnabled(true);
      setTwoFactorCode("");
      setTwoFactorTokenId(null);
      setTwoFactorModalVisible(false);
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Codigo invalido");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisableTwoFactor() {
    try {
      setLoading(true);
      await disableTwoFactor(disablePassword);
      setTwoFactorEnabled(false);
      setDisablePassword("");
      setDisableTwoFactorVisible(false);
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Nao foi possivel desativar");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleBiometria(value: boolean) {
    if (value) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert("Biometria", "Dispositivo sem suporte.");
        return;
      }
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert("Biometria", "Nenhuma biometria cadastrada.");
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirmar biometria",
      });
      if (!result.success) {
        return;
      }
    }

    setBiometria(value);
    await AsyncStorage.setItem("@biometriaEnabled", value ? "true" : "false");
  }

  async function handleChangePassword() {
    if (!senhaAtual || !novaSenha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    if (novaSenha !== confirmSenha) {
      Alert.alert("Erro", "As senhas nao conferem");
      return;
    }
    try {
      setLoading(true);
      await changePassword(senhaAtual, novaSenha);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmSenha("");
      setChangePasswordVisible(false);
      Alert.alert("Senha alterada", "Sua senha foi atualizada.");
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Nao foi possivel alterar");
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenSessions() {
    try {
      setSessionsLoading(true);
      const result = await listSessions();
      setCurrentSessionId(result.currentSessionId || null);
      setSessions(result.sessions || []);
      setSessionsVisible(true);
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Nao foi possivel carregar");
    } finally {
      setSessionsLoading(false);
    }
  }

  async function handleRevokeSession(id: string) {
    try {
      await revokeSession(id);
      setSessions((prev) => prev.filter((session) => session.id !== id));
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Nao foi possivel deslogar");
    }
  }

  async function handleRevokeOthers() {
    try {
      await revokeOtherSessions();
      setSessions((prev) =>
        prev.filter((session) => session.id === currentSessionId)
      );
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Nao foi possivel deslogar");
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seguranca</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => setChangePasswordVisible(true)}
          >
            <View style={[styles.iconWrap, { backgroundColor: "#E0ECFF" }]}>
              <Lock size={20} color="#3B82F6" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Alterar Senha</Text>
              <Text style={styles.cardSubtitle}>Atualize sua senha da conta</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: "#ECFDF5" }]}>
              <ShieldCheck size={20} color="#22C55E" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Autenticacao em Duas Etapas</Text>
              <Text style={styles.cardSubtitle}>
                Codigo enviado por email
              </Text>
            </View>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Switch
                value={twoFactorEnabled}
                onValueChange={handleToggleTwoFactor}
                trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
                thumbColor={twoFactorEnabled ? "#3B82F6" : "#FFF"}
              />
            )}
          </View>

          <View style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: "#F5F3FF" }]}>
              <Fingerprint size={20} color="#8B5CF6" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Biometria</Text>
              <Text style={styles.cardSubtitle}>
                Use digital ou Face ID para entrar
              </Text>
            </View>
            <Switch
              value={biometria}
              onValueChange={handleToggleBiometria}
              trackColor={{ false: "#E5E7EB", true: "#C4B5FD" }}
              thumbColor={biometria ? "#8B5CF6" : "#FFF"}
            />
          </View>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={handleOpenSessions}
          >
            <View style={[styles.iconWrap, { backgroundColor: "#FFF7ED" }]}>
              <Key size={20} color="#F97316" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Sessoes Ativas</Text>
              <Text style={styles.cardSubtitle}>
                Gerencie seus dispositivos conectados
              </Text>
            </View>
            {sessionsLoading ? (
              <ActivityIndicator />
            ) : (
              <ChevronRight size={20} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={changePasswordVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alterar senha</Text>
              <TouchableOpacity onPress={() => setChangePasswordVisible(false)}>
                <X size={18} color="#111827" />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Senha atual"
              secureTextEntry
              style={styles.modalInput}
              value={senhaAtual}
              onChangeText={setSenhaAtual}
            />
            <TextInput
              placeholder="Nova senha"
              secureTextEntry
              style={styles.modalInput}
              value={novaSenha}
              onChangeText={setNovaSenha}
            />
            <TextInput
              placeholder="Confirmar nova senha"
              secureTextEntry
              style={styles.modalInput}
              value={confirmSenha}
              onChangeText={setConfirmSenha}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.modalButtonText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={twoFactorModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirmar codigo</Text>
              <TouchableOpacity onPress={() => setTwoFactorModalVisible(false)}>
                <X size={18} color="#111827" />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Codigo de 6 digitos"
              keyboardType="numeric"
              style={styles.modalInput}
              value={twoFactorCode}
              onChangeText={setTwoFactorCode}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleConfirmTwoFactor}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.modalButtonText}>Confirmar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={disableTwoFactorVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Desativar 2FA</Text>
              <TouchableOpacity
                onPress={() => setDisableTwoFactorVisible(false)}
              >
                <X size={18} color="#111827" />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Senha atual"
              secureTextEntry
              style={styles.modalInput}
              value={disablePassword}
              onChangeText={setDisablePassword}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleDisableTwoFactor}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.modalButtonText}>Desativar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={sessionsVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardLarge}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sessoes ativas</Text>
              <TouchableOpacity onPress={() => setSessionsVisible(false)}>
                <X size={18} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 320 }}>
              {sessions.map((session) => {
                const isCurrent = session.id === currentSessionId;
                return (
                  <View key={session.id} style={styles.sessionRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sessionTitle}>
                        {session.userAgent || "Dispositivo"}
                      </Text>
                      <Text style={styles.sessionSubtitle}>
                        Ultimo acesso:{" "}
                        {session.ultimoAcesso
                          ? new Date(session.ultimoAcesso).toLocaleString()
                          : "-"}
                      </Text>
                      {isCurrent && (
                        <Text style={styles.sessionBadge}>Atual</Text>
                      )}
                    </View>
                    {!isCurrent && (
                      <TouchableOpacity
                        style={styles.sessionButton}
                        onPress={() => handleRevokeSession(session.id)}
                      >
                        <Text style={styles.sessionButtonText}>Deslogar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
              {!sessions.length && (
                <Text style={styles.emptyText}>Nenhuma sessao ativa.</Text>
              )}
            </ScrollView>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleRevokeOthers}>
              <Text style={styles.secondaryButtonText}>
                Deslogar outros dispositivos
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
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
  modalCardLarge: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  sessionSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  sessionBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#E0ECFF",
    color: "#2563EB",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sessionButton: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  sessionButtonText: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "600",
  },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#F59E0B",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#B45309",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 16,
  },
});
