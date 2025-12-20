import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "../services/api";

interface User {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn(email: string, senha: string): Promise<void>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const userStorage = await AsyncStorage.getItem("@user");
      const token = await AsyncStorage.getItem("@token");

      if (userStorage && token) {
        setUser(JSON.parse(userStorage));
      }
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, senha: string) {
    const result = await apiRequest("/auth/login", "POST", {
      email,
      senha,
    });

    await AsyncStorage.setItem("@token", result.token);
    await AsyncStorage.setItem("@user", JSON.stringify(result.user));

    setUser(result.user);
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
