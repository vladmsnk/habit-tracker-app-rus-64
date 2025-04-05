
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { timeService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ArrowRight, RotateCcw, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AlertConfirmation from "@/components/ui/alert-confirmation";

const TimeControlPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const { accessToken, refreshAuthToken } = useAuth();
  const { toast } = useToast();

  // Получение текущего времени системы
  const fetchCurrentTime = async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        return;
      }
      
      const time = await timeService.getCurrentTime(accessToken);
      setCurrentTime(time);
    } catch (error) {
      console.error("Ошибка при получении времени:", error);
      setCurrentTime("Недоступно");
      
      // Пробуем обновить токен, если причина в авторизации
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          fetchCurrentTime();
        }
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось получить текущее время системы.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Переход к следующему дню
  const handleNextDay = async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        return;
      }
      
      await timeService.nextDay(accessToken);
      toast({
        title: "Успешно",
        description: "Время переведено на следующий день.",
      });
      fetchCurrentTime();
    } catch (error) {
      console.error("Ошибка при переходе к следующему дню:", error);
      
      // Пробуем обновить токен, если причина в авторизации
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          handleNextDay();
        }
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось перейти к следующему дню.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Сброс времени
  const handleResetTime = async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        return;
      }
      
      await timeService.resetTime(accessToken);
      toast({
        title: "Успешно",
        description: "Время сброшено до текущего дня.",
      });
      fetchCurrentTime();
    } catch (error) {
      console.error("Ошибка при сбросе времени:", error);
      
      // Пробуем обновить токен, если причина в авторизации
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          handleResetTime();
        }
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось сбросить время.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCurrentTime();
    }
  }, [accessToken]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Управление временем</h1>
        <p className="text-muted-foreground mt-1">
          Управляйте временем в системе для тестирования привычек
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Текущее время системы</CardTitle>
          <CardDescription>
            Текущее время влияет на доступные действия с привычками
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg flex items-center gap-3 mb-6">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">
                {loading ? "Загрузка..." : currentTime || "Информация недоступна"}
              </p>
              <p className="text-sm text-muted-foreground">
                Это виртуальное время в системе, используемое для отслеживания привычек
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Перейти к следующему дню</h3>
                  <p className="text-sm text-muted-foreground">
                    Перемещает время на один день вперед
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <Button 
                className="w-full" 
                onClick={handleNextDay}
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Перейти к следующему дню"}
              </Button>
            </div>

            <div className="border rounded-lg p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Сбросить время</h3>
                  <p className="text-sm text-muted-foreground">
                    Сбрасывает время до текущего дня
                  </p>
                </div>
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setResetConfirmOpen(true)}
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Сбросить время"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Как время влияет на ваши привычки</CardTitle>
          <CardDescription>
            Важная информация о том, как системное время влияет на функциональность
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong>Текущий день:</strong> Позволяет создавать, модифицировать и удалять привычки.
            </li>
            <li>
              <strong>Будущие дни:</strong> Нельзя модифицировать или удалять привычки, но можно отмечать прогресс.
            </li>
            <li>
              <strong>Пропущенные дни:</strong> Если вы не отметили прогресс за день, система учтет это как пропуск.
            </li>
            <li>
              <strong>Серия выполнения:</strong> Сбрасывается, если вы пропустили отметку за день.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Диалог подтверждения сброса времени */}
      <AlertConfirmation
        open={resetConfirmOpen}
        onOpenChange={setResetConfirmOpen}
        title="Сброс времени"
        description="Вы уверены, что хотите сбросить время до текущего дня? Это может повлиять на отслеживание ваших привычек."
        confirmLabel="Сбросить"
        cancelLabel="Отмена"
        onConfirm={handleResetTime}
      />
    </div>
  );
};

export default TimeControlPage;
