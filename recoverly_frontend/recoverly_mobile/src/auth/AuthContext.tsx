import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextValue = {
  token: string | null;
  isLoading: boolean;
  login: (fakeToken?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Later: load token from SecureStore
    setIsLoading(false);
  }, []);

  const login = (fakeToken = "demo-token") => setToken(fakeToken);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
