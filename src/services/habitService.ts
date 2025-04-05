import { API_BASE_URL, handleResponse } from "./apiConfig";
import { CreateHabitRequest, UpdateHabitRequest, HabitListResponse } from "@/types";

export const habitService = {
  // GET /tracker/habits
  // Согласно Swagger возвращается массив объектов habit.ListUserHabitsResponse,
  // что соответствует типу HabitListResponse[].
  listHabits: async (token: string): Promise<HabitListResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/tracker/habits`, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    return handleResponse(response);
  },

  // GET /tracker/habits/completed
  // Возвращает массив завершённых привычек.
  listCompletedHabits: async (token: string): Promise<HabitListResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/tracker/habits/completed`, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    return handleResponse(response);
  },

  // POST /tracker/habits
  // Создаёт новую привычку. Принимает объект CreateHabitRequest,
  // возвращает строку (например, сообщение об успехе).
  createHabit: async (data: CreateHabitRequest, token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/tracker/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // PUT /tracker/habits
  // Обновляет привычку. Принимает объект UpdateHabitRequest, возвращает строку.
  updateHabit: async (data: UpdateHabitRequest, token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/tracker/habits`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // DELETE /tracker/habits/{habitId}
  // Удаляет привычку по её идентификатору, возвращая строку.
  deleteHabit: async (habitId: number, token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/tracker/habits/${habitId}`, {
      method: "DELETE",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    return handleResponse(response);
  },

  // GET /tracker/progress/{habitId}
  // Получает прогресс по привычке.
  // Согласно Swagger возвращается строка, хотя в типах определён интерфейс Progress.
  // Здесь тип возвращаемого значения оставляем string, как и в спецификации.
  getProgress: async (habitId: number, token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/tracker/progress/${habitId}`, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    return handleResponse(response);
  },

  // POST /tracker/progress/{habitId}
  // Добавляет прогресс для привычки. Возвращает строку.
  addProgress: async (habitId: number, token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/tracker/progress/${habitId}`, {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    return handleResponse(response);
  },

  // GET /tracker/reminder
  // Получает напоминания для пользователя. Возвращает строку.
  getReminders: async (token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/tracker/reminder`, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    return handleResponse(response);
  },
};
