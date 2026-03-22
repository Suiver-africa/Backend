import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_PIN_KEY = "auth_pin";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  savedPin: string | null;
  signIn: (token: string, pin: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePin: (pin: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedPin, setSavedPin] = useState<string | null>(null);

  // On mount, check if user is already authenticated
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        const pin = await SecureStore.getItemAsync(AUTH_PIN_KEY);
        if (token) {
          setIsLoggedIn(true);
          setSavedPin(pin);
        }
      } catch (err) {
        console.error("Failed to load auth state:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthState();
  }, []);

  const signIn = async (token: string, pin: string) => {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    await SecureStore.setItemAsync(AUTH_PIN_KEY, pin);
    setSavedPin(pin);
    setIsLoggedIn(true);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(AUTH_PIN_KEY);
    setSavedPin(null);
    setIsLoggedIn(false);
  };

  const updatePin = async (pin: string) => {
    await SecureStore.setItemAsync(AUTH_PIN_KEY, pin);
    setSavedPin(pin);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, savedPin, signIn, signOut, updatePin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
