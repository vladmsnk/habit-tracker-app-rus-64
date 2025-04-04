
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { register, loading } = useAuth();

  const validateForm = () => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    // Валидация имени пользователя
    if (!username.trim()) {
      newErrors.username = "Введите имя пользователя";
      isValid = false;
    } else if (username.length < 3 || username.length > 30) {
      newErrors.username = "Имя пользователя должно содержать от 3 до 30 символов";
      isValid = false;
    } else if (!/^[a-zA-Z0-9\s-]+$/.test(username)) {
      newErrors.username = "Имя пользователя может содержать только латиницу, цифры, пробелы и дефисы";
      isValid = false;
    }

    // Валидация email
    if (!email.trim()) {
      newErrors.email = "Введите email";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Введите корректный email";
      isValid = false;
    }

    // Валидация пароля
    if (!password) {
      newErrors.password = "Введите пароль";
      isValid = false;
    } else if (password.length < 5 || password.length > 40) {
      newErrors.password = "Пароль должен содержать от 5 до 40 символов";
      isValid = false;
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/.test(password)) {
      newErrors.password = "Пароль должен содержать минимум 1 букву и 1 цифру";
      isValid = false;
    }

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
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
      await register(username, email, password);
      onSwitchToLogin(); // После успешной регистрации переключаемся на форму входа
    } catch (error) {
      // Ошибка уже обрабатывается в контексте аутентификации
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Регистрация</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-username">Имя пользователя</Label>
            <Input
              id="register-username"
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
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Пароль</Label>
            <Input
              id="register-password"
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

          <div className="space-y-2">
            <Label htmlFor="register-confirm-password">Подтверждение пароля</Label>
            <Input
              id="register-confirm-password"
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className={errors.confirmPassword ? "border-destructive" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Выполняется регистрация...
              </>
            ) : (
              "Зарегистрироваться"
            )}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                onClick={onSwitchToLogin}
                disabled={loading}
              >
                Войти
              </Button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
