
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-white to-blue-50 px-4">
      <div className="max-w-md w-full space-y-8 mb-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
            TrackHabits
          </h1>
          <p className="text-slate-600 mb-8">
            Формируйте полезные привычки и отслеживайте свой прогресс
          </p>
        </div>

        {/* Форма авторизации или регистрации */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
          {showRegister ? (
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
          )}
        </div>
      </div>

      {/* Версия API */}
      {version && (
        <div className="text-sm text-slate-500">
          Версия API: {version}
        </div>
      )}
    </div>
  );
};

export default AuthPage;
