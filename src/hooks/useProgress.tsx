
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { habitService } from "@/services";
import { Progress } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export const useProgress = (habitId: number) => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const { accessToken, refreshAuthToken } = useAuth();
  const { toast } = useToast();

  const fetchProgress = async () => {
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
      
      const progressData = await habitService.getProgress(habitId, accessToken);
      setProgress(progressData);
    } catch (error) {
      console.error("Ошибка при получении прогресса:", error);
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          fetchProgress();
        }
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить прогресс.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const addProgress = async () => {
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
        description: "Вы успешно отметили прогресс по привычке.",
      });
      fetchProgress();
      return true;
    } catch (error) {
      console.error("Ошибка при добавлении прогресса:", error);
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          return addProgress();
        }
      }
      
      toast({
        title: "Ошибка",
        description: "Не удалось добавить прогресс. Попробуйте снова.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    progress,
    loading,
    fetchProgress,
    addProgress
  };
};
