import React, { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "../services/api";

interface User {
  id: string;
  nome: string;
  email: string;
  remuneracao: number;
}

interface SignInResult {
  requiresTwoFactor?: boolean;
  twoFactorTokenId?: string;
  email?: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn(email: string, senha: string): Promise<SignInResult | void>;
  verifyTwoFactor(tokenId: string, code: string): Promise<void>;
  updateProfile(nome: string, remuneracao: number): Promise<void>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const userStorage = await AsyncStorage.getItem("@user");
      const tokenStorage = await AsyncStorage.getItem("@token");

      if (userStorage && tokenStorage) {
        setUser(JSON.parse(userStorage));
        setToken(tokenStorage);
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

    if (result.requiresTwoFactor) {
      return {
        requiresTwoFactor: true,
        twoFactorTokenId: result.twoFactorTokenId,
        email: result.email,
      };
    }

    await AsyncStorage.setItem("@token", result.token);
    await AsyncStorage.setItem("@user", JSON.stringify(result.user));

    setUser(result.user);
    setToken(result.token);
  }

  async function verifyTwoFactor(tokenId: string, code: string) {
    const result = await apiRequest("/auth/verify-2fa", "POST", {
      tokenId,
      code,
    });

    await AsyncStorage.setItem("@token", result.token);
    await AsyncStorage.setItem("@user", JSON.stringify(result.user));

    setUser(result.user);
    setToken(result.token);
  }

  async function updateProfile(nome: string, remuneracao: number) {
    const tokenStorage = await AsyncStorage.getItem("@token");
    if (!tokenStorage) throw new Error("Token nao encontrado");

    const result = await apiRequest("/profile", "PUT", {
      nome,
      remuneracao,
    }, tokenStorage);

    await AsyncStorage.setItem("@user", JSON.stringify(result));
    setUser(result);
  }

  async function signOut() {
    const tokenStorage = await AsyncStorage.getItem("@token");
    if (tokenStorage) {
      try {
        await apiRequest("/auth/logout", "POST", undefined, tokenStorage);
      } catch {
        // Best effort only
      }
    }
    await AsyncStorage.clear();
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signIn, verifyTwoFactor, updateProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
