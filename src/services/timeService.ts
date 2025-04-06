
import { API_BASE_URL, handleResponse } from "./apiConfig";

export const timeService = {
  // Get current time
  getCurrentTime: async (token: string): Promise<string> => {
    const url = `${API_BASE_URL}/time/current-time`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": token,
      },
    });

    const result = await handleResponse(response, { method: "GET", url });
    // Если результат – объект с ключом currentTime, возвращаем его, иначе возвращаем результат как есть
    if (result && typeof result === "object" && "currentTime" in result) {
      return result.currentTime;
    }
    return result;
  },

  // Next day
  nextDay: async (token: string): Promise<string> => {
    const url = `${API_BASE_URL}/time/next-day`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": token
      }
    });

    return handleResponse(response, { method: "POST", url });
  },

  // Reset time
  resetTime: async (token: string): Promise<string> => {
    const url = `${API_BASE_URL}/time/reset-time`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": token
      }
    });

    return handleResponse(response, { method: "PUT", url });
  },
};
