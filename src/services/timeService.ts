
import { API_BASE_URL, handleResponse } from "./apiConfig";

export const timeService = {
  // Get current time
  getCurrentTime: async (token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/time/current-time`, {
      method: "GET",
      headers: {
        "Authorization": token,
      },
    });

    const result = await handleResponse(response);
    // Если результат – объект с ключом currentTime, возвращаем его, иначе возвращаем результат как есть
    if (result && typeof result === "object" && "currentTime" in result) {
      return result.currentTime;
    }
    return result;
  },


  // Next day
  nextDay: async (token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/time/next-day`, {
      method: "POST",
      headers: {
        "Authorization": token
      }
    });

    return handleResponse(response);
  },

  // Reset time
  resetTime: async (token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/time/reset-time`, {
      method: "PUT",
      headers: {
        "Authorization": token
      }
    });

    return handleResponse(response);
  },
};
