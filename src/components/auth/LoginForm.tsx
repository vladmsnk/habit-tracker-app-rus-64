
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const { login, loading } = useAuth();

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "Введите имя пользователя";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Введите пароль";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(username, password);
    } catch (error) {
      // Ошибка уже обрабатывается в контексте аутентификации
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg animate-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Вход в систему</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              id="username"
              placeholder="Введите имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className={errors.username ? "border-destructive" : ""}
            />
            {errors.username && (
              <p className="text-destructive text-sm">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Выполняется вход...
              </>
            ) : (
              "Войти"
            )}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Нет аккаунта?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                onClick={onSwitchToRegister}
                disabled={loading}
              >
                Зарегистрироваться
              </Button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
