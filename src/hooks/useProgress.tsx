
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { habitService } from "@/services";
import { Progress } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { showApiErrorToast } from "@/components/ui/api-error-toast";

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
      console.log("Progress data received:", progressData);
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
        showApiErrorToast(error, `Ошибка при получении прогресса для привычки ${habitId}`);
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
      await fetchProgress();
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
      
      showApiErrorToast(error, `Ошибка при добавлении прогресса для привычки ${habitId}`);
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
