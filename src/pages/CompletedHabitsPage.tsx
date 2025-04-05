
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { habitService } from "@/services/api";
import { Habit } from "@/types";
import { RefreshCw, Trophy, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const CompletedHabitsPage: React.FC = () => {
  const [completedHabits, setCompletedHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken, refreshAuthToken } = useAuth();
  const { toast } = useToast();

  // Загрузка завершенных привычек
  const fetchCompletedHabits = async () => {
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
      
      const result = await habitService.listCompletedHabits(accessToken);
      setCompletedHabits(result.habits || []);
    } catch (error) {
      console.error("Ошибка при получении завершенных привычек:", error);
      
      // Пробуем обновить токен, если причина в авторизации
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          fetchCompletedHabits();
        }
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить завершенные привычки.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCompletedHabits();
    }
  }, [accessToken]);

  // Функция для форматирования типа частоты
  const formatFrequencyType = (type: string) => {
    switch (type) {
      case "daily":
        return "ежедневно";
      case "weekly":
        return "еженедельно";
      case "monthly":
        return "ежемесячно";
      default:
        return type;
    }
  };

  // Функция для рендеринга карточки завершенной привычки
  const renderCompletedHabitCard = (habit: Habit) => (
    <Card key={habit.id} className="overflow-hidden card-gradient-secondary habit-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl" title={habit.description}>
            {habit.description}
          </CardTitle>
          <Badge className="bg-habit-completed text-white">Завершена</Badge>
        </div>
        <CardDescription>
          {habit.goal.times_per_frequency} раз {formatFrequencyType(habit.goal.frequency_type)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="bg-habit-completed/10 p-4 rounded-md flex items-center gap-3 border border-habit-completed/20">
          <Trophy className="h-5 w-5 text-habit-completed" />
          <div>
            <p className="font-medium">Привычка сформирована!</p>
            <p className="text-sm text-muted-foreground">
              Вы успешно выполнили задачу на протяжении {habit.goal.total_tracking_periods} периодов
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Button variant="outline" size="sm" disabled className="glass-card border-habit-completed/20 w-full sm:w-auto">
          <CalendarCheck className="h-4 w-4 mr-2 text-habit-completed" />
          Завершена
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card-gradient-primary p-6 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-habit-completed to-habit-completed/70 bg-clip-text text-transparent">
              Завершенные привычки
            </h1>
            <p className="text-muted-foreground mt-1">
              Список привычек, которые вы успешно сформировали
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCompletedHabits}
            disabled={loading}
            className="glass-card border-habit-completed/20"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>
      </div>

      {/* Отображение списка завершенных привычек */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2].map((i) => (
            <Card key={i} className="border p-6 space-y-4 card-gradient-secondary">
              <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              <div className="h-16 bg-muted rounded animate-pulse w-full mt-4"></div>
              <div className="flex justify-end pt-4">
                <div className="h-9 bg-muted rounded animate-pulse w-28"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : completedHabits.length === 0 ? (
        <Card className="card-gradient-secondary p-8 mt-8 text-center rounded-lg">
          <h3 className="text-lg font-medium">У вас пока нет завершенных привычек</h3>
          <p className="text-muted-foreground mt-2">
            Продолжайте работать над своими текущими привычками, и они появятся здесь после завершения
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {completedHabits.map(renderCompletedHabitCard)}
        </div>
      )}
    </div>
  );
};

export default CompletedHabitsPage;
