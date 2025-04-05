
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services";
import { AuthContextType, AuthState } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { showApiErrorToast } from "@/components/ui/api-error-toast";

// Initial authentication state
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  accessToken: null,
  refreshToken: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    // Check local storage for saved tokens
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth) as AuthState;
        return parsedAuth;
      } catch (error) {
        console.error("Error restoring session:", error);
      }
    }
    return initialAuthState;
  });
  
  const { toast } = useToast();

  // Save authentication state to local storage
  useEffect(() => {
    if (auth.isAuthenticated && auth.accessToken && auth.refreshToken) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else if (!auth.isAuthenticated) {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  // User login
  const login = async (username: string, password: string) => {
    setAuth((prev) => ({ ...prev, loading: true }));
    try {
      const result = await authService.login({ username, password });
      setAuth({
        isAuthenticated: true,
        user: username,
        loading: false,
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
      });
      toast({
        title: "Успешный вход",
        description: `Добро пожаловать, ${username}!`,
      });
    } catch (error) {
      setAuth((prev) => ({ ...prev, loading: false }));
      showApiErrorToast(error);
      throw error;
    }
  };

  // User registration
  const register = async (username: string, email: string, password: string) => {
    setAuth((prev) => ({ ...prev, loading: true }));
    try {
      await authService.register({ username, email, password });
      setAuth((prev) => ({ ...prev, loading: false }));
      toast({
        title: "Успешная регистрация",
        description: "Теперь вы можете войти в систему.",
      });
    } catch (error) {
      setAuth((prev) => ({ ...prev, loading: false }));
      showApiErrorToast(error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setAuth((prev) => ({ ...prev, loading: true }));
    try {
      if (auth.accessToken) {
        await authService.logout({ access_token: auth.accessToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
      showApiErrorToast(error);
    } finally {
      setAuth(initialAuthState);
      localStorage.removeItem('auth');
      toast({
        title: "Выход из системы",
        description: "Вы успешно вышли из системы.",
      });
    }
  };

  // Token refresh
  const refreshAuthToken = async (): Promise<boolean> => {
    if (!auth.refreshToken) return false;

    try {
      setAuth((prev) => ({ ...prev, loading: true }));
      const result = await authService.refreshToken({
        refresh_token: auth.refreshToken,
      });
      setAuth((prev) => ({
        ...prev,
        loading: false,
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        isAuthenticated: true,
      }));
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      // On refresh error, log out
      setAuth(initialAuthState);
      localStorage.removeItem('auth');
      toast({
        title: "Сессия истекла",
        description: "Пожалуйста, войдите снова.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    ...auth,
    login,
    register,
    logout,
    refreshAuthToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook for using the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
