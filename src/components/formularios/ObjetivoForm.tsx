import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Calendar, ChevronDown, ArrowLeft } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ObjetivoForm({ navigation }: any) {
  const [objetivo, setObjetivo] = useState("");
  const [valorAlvo, setValorAlvo] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [categoria, setCategoria] = useState("");

  const [data, setData] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);


  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>

        <View style={{ backgroundColor: "#FFF", paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#DDD" }}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft size={26} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title}>Novo Objetivo</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={styles.label}>Nome do Objetivo</Text>
          <TextInput
            placeholder="Ex: Curso programador"
            value={objetivo}
            onChangeText={setObjetivo}
            style={styles.input}
          />

          {/* CATEGORIA */}
          <Text style={styles.label}>Categoria *</Text>
          <TouchableOpacity style={styles.select}>
            <Text style={{ color: categoria ? "#000" : "#999" }}>
              {categoria || "Selecione uma categoria"}
            </Text>
            <ChevronDown size={20} color="#888" />
          </TouchableOpacity>

          {/* VALOR */}
          <Text style={styles.label}>Valor Alvo </Text>
          <View style={styles.valorBox}>
            <Text style={styles.rs}>R$</Text>
            <TextInput
              placeholder="0,00"
              keyboardType="numeric"
              value={valorAlvo}
              onChangeText={setValorAlvo}
              style={styles.valorInput}
            />
          </View>
          
          {/* VALOR */}
          <Text style={styles.label}>Valor Atual *</Text>
          <View style={styles.valorBox}>
            <Text style={styles.rs}>R$</Text>
            <TextInput
              placeholder="0,00"
              keyboardType="numeric"
              value={valorAtual}
              onChangeText={setValorAtual}
              style={styles.valorInput}
            />
          </View>

          {/* DATA */}
          <Text style={styles.label}>Data Desejada*</Text>

          <TouchableOpacity
            style={styles.select}
            onPress={() => setMostrarCalendario(true)}
          >
            <Text>{data.toLocaleDateString("pt-BR")}</Text>
            <Calendar size={20} color="#888" />
          </TouchableOpacity>

          {mostrarCalendario && (
            <DateTimePicker
              value={data}
              mode="date"
              onChange={(event: any, selectedDate?: Date) => {
                setMostrarCalendario(false);
                if (selectedDate) setData(selectedDate);
              }}
            />
          )}

          {/* BOTÃO SALVAR */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Criar Objetivo</Text>
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
    gap: 16,
    marginTop: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  tipoContainer: {
    flexDirection: "row",
    backgroundColor: "#EEE",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 5,
    paddingVertical: 5
  },

  tipoButton: {
    flex: 1,
    paddingVertical: 5,
    alignItems: "center",
    borderRadius: 12,
  },

  tipoAtivo: {
    backgroundColor: "#FFF",
  },

  tipoText: {
    fontSize: 16,
    color: "#555",
  },

  tipoTextAtivo: {
    color: "#000",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },

  rs: {
    fontSize: 20,
    fontWeight: "700",
    marginRight: 12,
    color: "#AAA"
  },

  valorBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: "#F5F6FA",
    borderWidth: 1,
    borderColor: "#DDD",
    boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)"
  },

  valorInput: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222"
  },

  select: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    borderWidth: 1,
    borderColor: "#DDD",
    boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)"
  },

  input: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: "#F5F6FA",
    borderWidth: 1,
    borderColor: "#DDD",
    boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)"
  },

  textarea: {
    padding: 14,
    borderRadius: 12,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 30,
    backgroundColor: "#F5F6FA",
    borderWidth: 1,
    borderColor: "#DDD",
  },

  button: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 50,
  },

  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
