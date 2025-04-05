
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { timeService } from "@/services";
import { useToast } from "@/components/ui/use-toast";

export const useTime = () => {
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { accessToken, refreshAuthToken } = useAuth();
  const { toast } = useToast();

  const getCurrentTime = async () => {
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
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          getCurrentTime();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const goToNextDay = async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        return false;
      }
      
      await timeService.nextDay(accessToken);
      toast({
        title: "Успешно",
        description: "Переход на следующий день выполнен.",
      });
      getCurrentTime();
      return true;
    } catch (error) {
      console.error("Ошибка при переходе на следующий день:", error);
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          return goToNextDay();
        }
      }
      
      toast({
        title: "Ошибка",
        description: "Не удалось перейти на следующий день.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetTime = async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        return false;
      }
      
      await timeService.resetTime(accessToken);
      toast({
        title: "Успешно",
        description: "Время сброшено на текущий день.",
      });
      getCurrentTime();
      return true;
    } catch (error) {
      console.error("Ошибка при сбросе времени:", error);
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          return resetTime();
        }
      }
      
      toast({
        title: "Ошибка",
        description: "Не удалось сбросить время.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentTime,
    loading,
    getCurrentTime,
    goToNextDay,
    resetTime
  };
};
