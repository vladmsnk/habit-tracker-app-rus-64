
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { habitService, timeService, mockData } from "@/services/api";
import { CreateHabitRequest, Habit, HabitListResponse, UpdateHabitRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Loader2, Clock } from "lucide-react";
import HabitCard from "@/components/habits/HabitCard";
import CreateHabitForm from "@/components/habits/CreateHabitForm";
import AlertConfirmation from "@/components/ui/alert-confirmation";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

const HomePage: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editHabitData, setEditHabitData] = useState<Habit | undefined>(undefined);
  const [deleteHabitId, setDeleteHabitId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [timeLoading, setTimeLoading] = useState(false);
  const { accessToken, refreshAuthToken } = useAuth();
  const { toast } = useToast();

  // Загрузка привычек
  const fetchHabits = async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        // Используем мок-данные, если нет токена (для демонстрации)
        setHabits(mockData.habits);
        return;
      }
      
      const result = await habitService.listHabits(accessToken);
      setHabits(result.habits || []);
    } catch (error) {
      console.error("Ошибка при получении привычек:", error);
      // Используем мок-данные в случае ошибки
      setHabits(mockData.habits);
      
      // Пробуем обновить токен, если причина в авторизации
      if (error instanceof Error && error.message.includes("401")) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          fetchHabits();
        }
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить привычки. Используются демо-данные.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Получение текущего времени системы
  const fetchCurrentTime = async () => {
    setTimeLoading(true);
    try {
      if (!accessToken) {
        setCurrentTime("Демо-режим");
        return;
      }
      
      const time = await timeService.getCurrentTime(accessToken);
      setCurrentTime(time);
    } catch (error) {
      console.error("Ошибка при получении времени:", error);
      setCurrentTime("Недоступно");
      
      // Пробуем обновить токен, если причина в авторизации
      if (error instanceof Error && error.message.includes("401")) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          fetchCurrentTime();
        }
      }
    } finally {
      setTimeLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchHabits();
    fetchCurrentTime();
  }, [accessToken]);

  // Создание привычки
  const handleCreateHabit = async (habitData: CreateHabitRequest) => {
    try {
      if (!accessToken) return;
      
      await habitService.createHabit(habitData, accessToken);
      toast({
        title: "Привычка создана",
        description: "Новая привычка успешно создана.",
      });
      fetchHabits();
    } catch (error) {
      console.error("Ошибка при создании привычки:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать привычку. Попробуйте снова.",
        variant: "destructive",
      });
      
      // Пробуем обновить токен, если причина в авторизации
      if (error instanceof Error && error.message.includes("401")) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          setCreateDialogOpen(true); // Повторно открываем диалог
        }
      }
      
      throw error;
    }
  };

  // Обновление привычки
  const handleUpdateHabit = async (habitData: CreateHabitRequest) => {
    try {
      if (!accessToken || !editHabitData) return;
      
      const updateData: UpdateHabitRequest = {
        ...habitData,
        id: editHabitData.id
      };
      
      await habitService.updateHabit(updateData, accessToken);
      toast({
        title: "Привычка обновлена",
        description: "Привычка успешно обновлена.",
      });
      fetchHabits();
      setEditHabitData(undefined);
    } catch (error) {
      console.error("Ошибка при обновлении привычки:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить привычку. Попробуйте снова.",
        variant: "destructive",
      });
      
      // Пробуем обновить токен, если причина в авторизации
      if (error instanceof Error && error.message.includes("401")) {
        const refreshed = await refreshAuthToken();
        if (refreshed && editHabitData) {
          setEditHabitData(editHabitData);
        }
      }
      
      throw error;
    }
  };

  // Удаление привычки
  const handleDeleteHabit = async () => {
    try {
      if (!accessToken || !deleteHabitId) return;
      
      await habitService.deleteHabit(deleteHabitId, accessToken);
      toast({
        title: "Привычка удалена",
        description: "Привычка успешно удалена.",
      });
      fetchHabits();
    } catch (error) {
      console.error("Ошибка при удалении привычки:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить привычку. Попробуйте снова.",
        variant: "destructive",
      });
      
      // Пробуем обновить токен, если причина в авторизации
      if (error instanceof Error && error.message.includes("401")) {
        const refreshed = await refreshAuthToken();
        if (refreshed && deleteHabitId) {
          setDeleteHabitId(deleteHabitId);
        }
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card-gradient-primary p-6 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Мои привычки</h1>
            <p className="text-muted-foreground mt-1">
              Управляйте своими привычками и отслеживайте прогресс
            </p>
            {currentTime && (
              <div className="flex items-center text-sm text-primary mt-2">
                <Clock className="h-4 w-4 mr-1" />
                {timeLoading ? "Загрузка..." : currentTime}
              </div>
            )}
          </div>
          <div className="flex gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchHabits();
                fetchCurrentTime();
              }}
              disabled={loading || timeLoading}
              className="glass-card border-primary/20"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading || timeLoading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
            <Button 
              onClick={() => setCreateDialogOpen(true)} 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить привычку
            </Button>
          </div>
        </div>
      </div>

      {/* Отображение списка привычек */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border p-6 space-y-4 card-gradient-primary">
              <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              <div className="h-2 bg-muted rounded animate-pulse w-full mt-4"></div>
              <div className="flex justify-between pt-4">
                <div className="h-9 bg-muted rounded animate-pulse w-20"></div>
                <div className="h-9 bg-muted rounded animate-pulse w-20"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : habits.length === 0 ? (
        <Card className="card-gradient-secondary p-8 mt-8 text-center rounded-lg">
          <h3 className="text-lg font-medium">У вас пока нет привычек</h3>
          <p className="text-muted-foreground mt-2">
            Создайте свою первую привычку, чтобы начать отслеживать прогресс
          </p>
          <Button 
            onClick={() => setCreateDialogOpen(true)} 
            className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить привычку
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={(habit) => setEditHabitData(habit)}
              onDelete={(habitId) => setDeleteHabitId(habitId)}
              onAddProgress={fetchHabits}
            />
          ))}
        </div>
      )}

      {/* Диалог создания/редактирования привычки */}
      <CreateHabitForm
        open={createDialogOpen || !!editHabitData}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditHabitData(undefined);
          }
        }}
        onSubmit={editHabitData ? handleUpdateHabit : handleCreateHabit}
        initialData={editHabitData}
        isEditing={!!editHabitData}
      />

      {/* Диалог подтверждения удаления */}
      <AlertConfirmation
        open={!!deleteHabitId}
        onOpenChange={(open) => !open && setDeleteHabitId(null)}
        title="Удаление привычки"
        description="Вы уверены, что хотите удалить эту привычку? Это действие невозможно отменить."
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        onConfirm={handleDeleteHabit}
        destructive
      />
    </div>
  );
};

export default HomePage;
