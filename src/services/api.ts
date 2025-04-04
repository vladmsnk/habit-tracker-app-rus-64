
import { 
  LoginRequest, 
  RegisterRequest, 
  RefreshTokenRequest, 
  LogoutRequest,
  CreateHabitRequest,
  UpdateHabitRequest,
  HabitListResponse,
  Progress,
  VersionResponse,
  FrequencyType
} from "@/types";

// Мок данные для имитации работы API
export const mockData = {
  // Список привычек для основной страницы
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
      description: "Медитация",
      goal: {
        id: 3,
        frequency_type: "daily" as FrequencyType,
        times_per_frequency: 2,
        total_tracking_periods: 21
      }
    },
    {
      id: 4,
      description: "Изучение иностранного языка",
      goal: {
        id: 4,
        frequency_type: "daily" as FrequencyType,
        times_per_frequency: 1,
        total_tracking_periods: 60
      }
    },
    {
      id: 5,
      description: "Здоровое питание",
      goal: {
        id: 5,
        frequency_type: "daily" as FrequencyType,
        times_per_frequency: 3,
        total_tracking_periods: 21
      }
    },
    {
      id: 6,
      description: "Планирование дня",
      goal: {
        id: 6,
        frequency_type: "daily" as FrequencyType,
        times_per_frequency: 1,
        total_tracking_periods: 14
      }
    },
    {
      id: 7,
      description: "Силовые тренировки",
      goal: {
        id: 7,
        frequency_type: "weekly" as FrequencyType,
        times_per_frequency: 3,
        total_tracking_periods: 8
      }
    }
  ],
  
  // Список завершенных привычек
  completedHabits: [
    {
      id: 8,
      description: "Питьевой режим",
      goal: {
        id: 8,
        frequency_type: "daily" as FrequencyType,
        times_per_frequency: 8,
        total_tracking_periods: 30
      }
    },
    {
      id: 9,
      description: "Принимать витамины",
      goal: {
        id: 9,
        frequency_type: "daily" as FrequencyType,
        times_per_frequency: 1,
        total_tracking_periods: 60
      }
    },
    {
      id: 10,
      description: "Ведение дневника",
      goal: {
        id: 10,
        frequency_type: "daily" as FrequencyType,
        times_per_frequency: 1,
        total_tracking_periods: 21
      }
    }
  ],
  
  // Пример прогресса для привычек
  progress: {
    total_completed_periods: 15,
    total_completed_times: 45,
    total_skipped_periods: 2,
    most_longest_streak: 12,
    current_streak: 8,
    total_tracking_periods: 30 // Добавляем для совместимости
  }
};

// Имитация задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Сервис аутентификации
export const authService = {
  // Регистрация пользователя
  register: async (data: RegisterRequest): Promise<string> => {
    await delay(800);
    return "Регистрация успешно завершена";
  },

  // Авторизация пользователя
  login: async (data: LoginRequest): Promise<{ access_token: string, refresh_token: string }> => {
    await delay(800);
    return {
      access_token: "mock_access_token_" + Date.now(),
      refresh_token: "mock_refresh_token_" + Date.now()
    };
  },

  // Обновление токена
  refreshToken: async (data: RefreshTokenRequest): Promise<{ access_token: string, refresh_token: string }> => {
    await delay(500);
    return {
      access_token: "mock_access_token_refreshed_" + Date.now(),
      refresh_token: "mock_refresh_token_refreshed_" + Date.now()
    };
  },

  // Выход из системы
  logout: async (data: LogoutRequest): Promise<string> => {
    await delay(500);
    return "Выход выполнен успешно";
  },
};

// Сервис для работы с привычками
export const habitService = {
  // Получение списка привычек
  listHabits: async (token: string): Promise<HabitListResponse> => {
    await delay(1000);
    return {
      username: "Тестовый пользователь",
      habits: mockData.habits
    };
  },

  // Получение списка завершенных привычек
  listCompletedHabits: async (token: string): Promise<HabitListResponse> => {
    await delay(1000);
    return {
      username: "Тестовый пользователь",
      habits: mockData.completedHabits
    };
  },

  // Создание привычки
  createHabit: async (data: CreateHabitRequest, token: string): Promise<string> => {
    await delay(800);
    return "Привычка успешно создана";
  },

  // Обновление привычки
  updateHabit: async (data: UpdateHabitRequest, token: string): Promise<string> => {
    await delay(800);
    return "Привычка успешно обновлена";
  },

  // Удаление привычки
  deleteHabit: async (habitId: number, token: string): Promise<string> => {
    await delay(700);
    return "Привычка успешно удалена";
  },

  // Получение прогресса привычки
  getProgress: async (habitId: number, token: string): Promise<Progress> => {
    await delay(700);
    return mockData.progress;
  },

  // Добавление прогресса
  addProgress: async (habitId: number, token: string): Promise<string> => {
    await delay(600);
    return "Прогресс успешно добавлен";
  },

  // Получение напоминаний
  getReminders: async (token: string): Promise<string> => {
    await delay(600);
    return "У вас есть 3 привычки, которые стоит выполнить сегодня";
  },
};

// Сервис для работы со временем
export const timeService = {
  // Получение текущего времени
  getCurrentTime: async (token: string): Promise<string> => {
    return new Date().toLocaleString('ru-RU');
  },

  // Переход к следующему дню
  nextDay: async (token: string): Promise<string> => {
    await delay(500);
    return "Переход к следующему дню выполнен";
  },

  // Сброс времени
  resetTime: async (token: string): Promise<string> => {
    await delay(500);
    return "Время сброшено к текущему дню";
  },
};

// Сервис для получения версии API
export const versionService = {
  getVersion: async (): Promise<VersionResponse> => {
    await delay(300);
    return { version: "1.0.0" };
  },
};
