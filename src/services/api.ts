
import { 
  LoginRequest, 
  RegisterRequest, 
  RefreshTokenRequest, 
  LogoutRequest,
  CreateHabitRequest,
  UpdateHabitRequest,
  HabitListResponse,
  Progress,
  VersionResponse
} from "@/types";

const API_BASE_URL = "http://trackhabits.ru:7001/api/v1";

// Вспомогательная функция для обработки ответов
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  
  if (!response.ok) {
    let errorMessage;
    
    try {
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        errorMessage = error.message || response.statusText;
      } else {
        errorMessage = await response.text();
      }
    } catch {
      errorMessage = response.statusText;
    }
    
    const error = new Error(errorMessage);
    // Добавляем статус чтобы обрабатывать 401 ошибки
    (error as any).status = response.status;
    throw error;
  }
  
  // Если ответ пустой, возвращаем true
  if (response.status === 204) {
    return true;
  }
  
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  
  return response.text();
};

// Сервис аутентификации
export const authService = {
  // Регистрация пользователя
  register: async (data: RegisterRequest): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
  },

  // Авторизация пользователя
  login: async (data: LoginRequest): Promise<{ access_token: string, refresh_token: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
  },

  // Обновление токена
  refreshToken: async (data: RefreshTokenRequest): Promise<{ access_token: string, refresh_token: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
  },

  // Выход из системы
  logout: async (data: LogoutRequest): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
  },
};

// Сервис для работы с привычками
export const habitService = {
  // Получение списка привычек
  listHabits: async (token: string): Promise<HabitListResponse> => {
    const response = await fetch(`${API_BASE_URL}/tracker/habits`, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },

  // Получение списка завершенных привычек
  listCompletedHabits: async (token: string): Promise<HabitListResponse> => {
    const response = await fetch(`${API_BASE_URL}/tracker/habits/completed`, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },

  // Создание привычки
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

  // Обновление привычки
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

  // Удаление привычки
  deleteHabit: async (habitId: number, token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/tracker/habits/${habitId}`, {
      method: "DELETE",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },

  // Получение прогресса привычки
  getProgress: async (habitId: number, token: string): Promise<Progress> => {
    const response = await fetch(`${API_BASE_URL}/tracker/progress/${habitId}`, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },

  // Добавление прогресса
  addProgress: async (habitId: number, token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/tracker/progress/${habitId}`, {
      method: "POST",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },

  // Получение напоминаний
  getReminders: async (token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/tracker/reminder`, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },
};

// Сервис для работы со временем
export const timeService = {
  // Получение текущего времени
  getCurrentTime: async (token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/time/current-time`, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },

  // Переход к следующему дню
  nextDay: async (token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/time/next-day`, {
      method: "POST",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },

  // Сброс времени
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

// Сервис для получения версии API
export const versionService = {
  getVersion: async (): Promise<VersionResponse> => {
    const response = await fetch(`${API_BASE_URL}/version`, {
      method: "GET"
    });
    
    return handleResponse(response);
  },
};
