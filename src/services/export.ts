import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, API_URL } from "./api";

async function getToken() {
  const token = await AsyncStorage.getItem("@token");
  if (!token) throw new Error("Token nao encontrado");
  return token;
}

export async function getExportSummary() {
  const token = await getToken();
  return apiRequest("/export/summary", "GET", undefined, token);
}

export async function downloadExport(format: "csv" | "json") {
  const token = await getToken();
  const res = await fetch(`${API_URL}/export?format=${format}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Erro ao exportar");
  }

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  return { text, contentType };
}
