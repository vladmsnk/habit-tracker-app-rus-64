
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/api";
import { AuthContextType, AuthState } from "@/types";
import { useToast } from "@/components/ui/use-toast";

// Начальное состояние аутентификации
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  accessToken: null,
  refreshToken: null,
};

// Создание контекста
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контекста
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    // Проверяем локальное хранилище для сохраненных токенов
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth) as AuthState;
        return parsedAuth;
      } catch (error) {
        console.error("Ошибка при восстановлении сессии:", error);
      }
    }
    return initialAuthState;
  });
  
  const { toast } = useToast();

  // Сохраняем состояние аутентификации в локальное хранилище
  useEffect(() => {
    if (auth.isAuthenticated && auth.accessToken && auth.refreshToken) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else if (!auth.isAuthenticated) {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  // Авторизация пользователя
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
      toast({
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Регистрация пользователя
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
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Выход из системы
  const logout = async () => {
    setAuth((prev) => ({ ...prev, loading: true }));
    try {
      if (auth.accessToken) {
        await authService.logout({ access_token: auth.accessToken });
      }
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    } finally {
      setAuth(initialAuthState);
      localStorage.removeItem('auth');
      toast({
        title: "Выход из системы",
        description: "Вы успешно вышли из системы.",
      });
    }
  };

  // Обновление токена
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
      console.error("Ошибка при обновлении токена:", error);
      // При ошибке обновления токена выходим из системы
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

  // Предоставляем значение контекста
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

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
};
