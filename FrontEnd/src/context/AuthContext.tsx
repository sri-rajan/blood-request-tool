import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { loginApi, logoutApi } from "../api/auth.api";
import type { LoginRequest, User } from "../types/auth.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    accessToken: null,
  });

  const login = async (data: LoginRequest) => {
    const res = await loginApi(data);

    setAuth({
      user: res.user,
      accessToken: res.accessToken,
    });
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAuth({
        user: null,
        accessToken: null,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
