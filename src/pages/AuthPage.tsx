
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { versionService } from "@/services/api";

const AuthPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [version, setVersion] = useState<string | null>(null);

  React.useEffect(() => {
    // Получаем версию API
    const fetchVersion = async () => {
      try {
        const result = await versionService.getVersion();
        setVersion(result.version);
      } catch (error) {
        console.error("Ошибка при получении версии API:", error);
        setVersion("Недоступно");
      }
    };

    fetchVersion();
  }, []);

  // Если пользователь уже аутентифицирован, перенаправляем на главную страницу
  if (isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center auth-gradient px-4">
      <div className="max-w-md w-full space-y-8 mb-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            TrackHabits
          </h1>
          <p className="text-muted-foreground mb-8">
            Формируйте полезные привычки и отслеживайте свой прогресс
          </p>
        </div>

        {/* Форма авторизации или регистрации */}
        {showRegister ? (
          <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>

      {/* Версия API */}
      {version && (
        <div className="text-sm text-muted-foreground">
          Версия API: {version}
        </div>
      )}
    </div>
  );
};

export default AuthPage;
