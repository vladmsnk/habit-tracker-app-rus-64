
import React, { useState, useEffect } from "react";
import { Habit, Progress } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Edit, Trash2, Trophy, Calendar, BarChart3 } from "lucide-react";
import { habitService, mockData } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: number) => void;
  onAddProgress: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete, onAddProgress }) => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const { accessToken, refreshAuthToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProgress();
  }, [habit.id]);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        // Используем мок-данные, если нет токена (для демонстрации)
        setProgress(mockData.progress);
        return;
      }
      
      const progressData = await habitService.getProgress(habit.id, accessToken);
      setProgress(progressData);
    } catch (error) {
      console.error("Ошибка при получении прогресса:", error);
      // Используем мок-данные в случае ошибки
      setProgress(mockData.progress);
      
      // Пробуем обновить токен, если причина в авторизации
      if (error instanceof Error && error.message.includes("401")) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          fetchProgress();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgress = async () => {
    try {
      if (!accessToken) return;
      
      await habitService.addProgress(habit.id, accessToken);
      toast({
        title: "Прогресс добавлен",
        description: "Вы успешно отметили прогресс по привычке.",
      });
      fetchProgress();
      onAddProgress();
    } catch (error) {
      console.error("Ошибка при добавлении прогресса:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить прогресс. Попробуйте снова.",
        variant: "destructive",
      });
      
      // Пробуем обновить токен, если причина в авторизации
      if (error instanceof Error && error.message.includes("401")) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          handleAddProgress();
        }
      }
    }
  };

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

  // Отображение прогресса
  const renderProgress = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
    }

    if (!progress) {
      return <p className="text-sm text-muted-foreground">Данные о прогрессе недоступны</p>;
    }

    const { total_completed_periods } = progress;
    const totalTrackingPeriods = habit.goal.total_tracking_periods;
    const completionPercentage = Math.min(
      Math.round((total_completed_periods / totalTrackingPeriods) * 100),
      100
    );

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Прогресс</span>
          <span className="text-sm">{completionPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-value" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{total_completed_periods} из {totalTrackingPeriods} периодов</span>
          {progress.current_streak > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              Серия: {progress.current_streak}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl truncate" title={habit.description}>
              {habit.description}
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatFrequencyType(habit.goal.frequency_type)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {habit.goal.times_per_frequency} раз {formatFrequencyType(habit.goal.frequency_type)}
          </p>
        </CardHeader>
        <CardContent className="pb-2">{renderProgress()}</CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(habit)}>
              <Edit className="h-4 w-4 mr-1" />
              Изменить
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(habit.id)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Удалить
            </Button>
          </div>
          <div className="flex gap-2">
            <DialogTrigger asChild onClick={() => setShowProgressDialog(true)}>
              <Button size="sm" variant="outline">
                <BarChart3 className="h-4 w-4 mr-1" />
                Детали
              </Button>
            </DialogTrigger>
            <Button size="sm" onClick={handleAddProgress}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Отметить
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Детали прогресса</DialogTitle>
            <DialogDescription>
              Подробная статистика вашего прогресса по привычке "{habit.description}"
            </DialogDescription>
          </DialogHeader>
          
          {progress ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Всего выполнено периодов</p>
                  <p className="text-2xl font-bold">{progress.total_completed_periods}</p>
                  <p className="text-xs text-muted-foreground">из {habit.goal.total_tracking_periods}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Текущая серия</p>
                  <p className="text-2xl font-bold">{progress.current_streak}</p>
                  <p className="text-xs text-muted-foreground">периодов подряд</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Лучшая серия</p>
                  <p className="text-2xl font-bold">{progress.most_longest_streak}</p>
                  <p className="text-xs text-muted-foreground">периодов подряд</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Пропущено периодов</p>
                  <p className="text-2xl font-bold">{progress.total_skipped_periods}</p>
                  <p className="text-xs text-muted-foreground">всего</p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button className="w-full" onClick={handleAddProgress}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Отметить прогресс
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">Загрузка данных...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HabitCard;
