
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

const API_BASE_URL = 'http://trackhabits.ru:7001/api/v1';

// Функция для обработки ответа API
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка HTTP: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  
  return response.text() as unknown as Promise<T>;
}

// Базовая функция для запросов к API
async function fetchApi<T>(
  endpoint: string, 
  method: string = 'GET', 
  body?: any, 
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return handleResponse<T>(response);
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

// Сервис аутентификации
export const authService = {
  // Регистрация пользователя
  register: (data: RegisterRequest): Promise<string> => {
    return fetchApi<string>('/auth/register', 'POST', data);
  },

  // Авторизация пользователя
  login: (data: LoginRequest): Promise<{ access_token: string, refresh_token: string }> => {
    return fetchApi<{ access_token: string, refresh_token: string }>('/auth/login', 'POST', data);
  },

  // Обновление токена
  refreshToken: (data: RefreshTokenRequest): Promise<{ access_token: string, refresh_token: string }> => {
    return fetchApi<{ access_token: string, refresh_token: string }>('/auth/refresh', 'POST', data);
  },

  // Выход из системы
  logout: (data: LogoutRequest): Promise<string> => {
    return fetchApi<string>('/auth/logout', 'POST', data);
  },
};

// Сервис для работы с привычками
export const habitService = {
  // Получение списка привычек
  listHabits: (token: string): Promise<HabitListResponse> => {
    return fetchApi<HabitListResponse>('/tracker/habits', 'GET', undefined, token);
  },

  // Получение списка завершенных привычек
  listCompletedHabits: (token: string): Promise<HabitListResponse> => {
    return fetchApi<HabitListResponse>('/tracker/habits/completed', 'GET', undefined, token);
  },

  // Создание привычки
  createHabit: (data: CreateHabitRequest, token: string): Promise<string> => {
    return fetchApi<string>('/tracker/habits', 'POST', data, token);
  },

  // Обновление привычки
  updateHabit: (data: UpdateHabitRequest, token: string): Promise<string> => {
    return fetchApi<string>('/tracker/habits', 'PUT', data, token);
  },

  // Удаление привычки
  deleteHabit: (habitId: number, token: string): Promise<string> => {
    return fetchApi<string>(`/tracker/habits/${habitId}`, 'DELETE', undefined, token);
  },

  // Получение прогресса привычки
  getProgress: (habitId: number, token: string): Promise<Progress> => {
    return fetchApi<Progress>(`/tracker/progress/${habitId}`, 'GET', undefined, token);
  },

  // Добавление прогресса
  addProgress: (habitId: number, token: string): Promise<string> => {
    return fetchApi<string>(`/tracker/progress/${habitId}`, 'POST', undefined, token);
  },

  // Получение напоминаний
  getReminders: (token: string): Promise<string> => {
    return fetchApi<string>('/tracker/reminder', 'GET', undefined, token);
  },
};

// Сервис для работы со временем
export const timeService = {
  // Получение текущего времени
  getCurrentTime: (token: string): Promise<string> => {
    return fetchApi<string>('/time/current-time', 'GET', undefined, token);
  },

  // Переход к следующему дню
  nextDay: (token: string): Promise<string> => {
    return fetchApi<string>('/time/next-day', 'POST', undefined, token);
  },

  // Сброс времени
  resetTime: (token: string): Promise<string> => {
    return fetchApi<string>('/time/reset-time', 'PUT', undefined, token);
  },
};

// Сервис для получения версии API
export const versionService = {
  getVersion: (): Promise<VersionResponse> => {
    return fetchApi<VersionResponse>('/version', 'GET');
  },
};

// Мок данные для случая, если API не доступен
export const mockData = {
  habits: [
    {
      id: 1,
      description: "Ежедневная тренировка",
      goal: {
        id: 1,
        frequency_type: "daily" as FrequencyType,
        times_per_frequency: 1,
        total_tracking_periods: 30
      }
    },
    {
      id: 2,
      description: "Чтение книг",
      goal: {
        id: 2,
        frequency_type: "weekly" as FrequencyType,
        times_per_frequency: 3,
        total_tracking_periods: 12
      }
    },
    {
      id: 3,
      description: "Meditation",
      goal: {
        id: 3,
        frequency_type: "daily" as FrequencyType,
        times_per_frequency: 2,
        total_tracking_periods: 21
      }
    }
  ],
  completedHabits: [
    {
      id: 4,
      description: "Питьевой режим",
      goal: {
        id: 4,
        frequency_type: "daily" as FrequencyType,
        times_per_frequency: 8,
        total_tracking_periods: 30
      }
    }
  ],
  progress: {
    total_completed_periods: 15,
    total_completed_times: 45,
    total_skipped_periods: 2,
    most_longest_streak: 12,
    current_streak: 8
  }
};
