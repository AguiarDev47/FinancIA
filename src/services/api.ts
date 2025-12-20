export const API_URL = "http://10.0.2.2:3333";

export async function apiRequest(
  path: string,
  method: "GET" | "POST" = "GET",
  body?: any,
  token?: string
) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erro inesperado");
  }

  return data;
}
