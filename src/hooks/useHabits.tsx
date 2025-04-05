
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { habitService } from "@/services";
import { Habit, CreateHabitRequest, UpdateHabitRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { showApiErrorToast } from "@/components/ui/api-error-toast";

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken, refreshAuthToken } = useAuth();
  const { toast } = useToast();

  const fetchHabits = async () => {
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
      
      const result = await habitService.listHabits(accessToken);
      setHabits(result.habits || []);
    } catch (error) {
      console.error("Ошибка при получении привычек:", error);
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          fetchHabits();
        }
      } else {
        showApiErrorToast(error);
      }
    } finally {
      setLoading(false);
    }
  };

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
      setHabits(result.habits || []);
    } catch (error) {
      console.error("Ошибка при получении завершенных привычек:", error);
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          fetchCompletedHabits();
        }
      } else {
        showApiErrorToast(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async (habitData: CreateHabitRequest) => {
    try {
      if (!accessToken) {
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        return;
      }
      
      await habitService.createHabit(habitData, accessToken);
      toast({
        title: "Привычка создана",
        description: "Новая привычка успешно создана.",
      });
      fetchHabits();
      return true;
    } catch (error) {
      console.error("Ошибка при создании привычки:", error);
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          try {
            if (accessToken) {
              await habitService.createHabit(habitData, accessToken);
              toast({
                title: "Привычка создана",
                description: "Новая привычка успешно создана.",
              });
              fetchHabits();
              return true;
            }
          } catch (e) {
            console.error("Повторная ошибка создания привычки:", e);
            showApiErrorToast(e);
          }
        }
      } else {
        showApiErrorToast(error);
      }
      
      return false;
    }
  };

  const updateHabit = async (habitData: UpdateHabitRequest) => {
    try {
      if (!accessToken) {
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        return false;
      }
      
      await habitService.updateHabit(habitData, accessToken);
      toast({
        title: "Привычка обновлена",
        description: "Привычка успешно обновлена.",
      });
      fetchHabits();
      return true;
    } catch (error) {
      console.error("Ошибка при обновлении привычки:", error);
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          toast({
            title: "Требуется повторная попытка",
            description: "Пожалуйста, попробуйте сохранить изменения еще раз.",
          });
          return false;
        }
      }
      
      showApiErrorToast(error);
      return false;
    }
  };

  const deleteHabit = async (habitId: number) => {
    try {
      if (!accessToken) {
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        return false;
      }
      
      await habitService.deleteHabit(habitId, accessToken);
      toast({
        title: "Привычка удалена",
        description: "Привычка успешно удалена.",
      });
      fetchHabits();
      return true;
    } catch (error) {
      console.error("Ошибка при удалении привычки:", error);
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          toast({
            title: "Требуется повторная попытка",
            description: "Пожалуйста, попробуйте удалить привычку еще раз.",
          });
          return false;
        }
      }
      
      showApiErrorToast(error);
      return false;
    }
  };

  const addProgress = async (habitId: number) => {
    try {
      if (!accessToken) {
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        return false;
      }
      
      await habitService.addProgress(habitId, accessToken);
      toast({
        title: "Прогресс добавлен",
        description: "Прогресс успешно отмечен.",
      });
      fetchHabits();
      return true;
    } catch (error) {
      console.error("Ошибка при добавлении прогресса:", error);
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          toast({
            title: "Требуется повторная попытка",
            description: "Пожалуйста, попробуйте отметить прогресс еще раз.",
          });
          return false;
        }
      }
      
      showApiErrorToast(error);
      return false;
    }
  };

  return {
    habits,
    loading,
    fetchHabits,
    fetchCompletedHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    addProgress
  };
};
