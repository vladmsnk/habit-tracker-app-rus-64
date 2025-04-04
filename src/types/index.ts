
// Типы для аутентификации
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  access_token: string;
}

// Типы для привычек
export type FrequencyType = 'daily' | 'weekly' | 'monthly';

export interface Goal {
  id?: number;
  frequency_type: FrequencyType;
  times_per_frequency: number;
  total_tracking_periods: number;
}

export interface CreateHabitRequest {
  description: string;
  goal: Omit<Goal, 'id'>;
}

export interface Habit {
  id: number;
  description: string;
  goal: Goal;
}

export interface HabitListResponse {
  username: string;
  habits: Habit[];
}

export interface UpdateHabitRequest {
  id: number;
  description: string;
  goal: Omit<Goal, 'id'>;
}

// Типы для прогресса
export interface Progress {
  total_completed_periods: number;
  total_completed_times: number;
  total_skipped_periods: number;
  most_longest_streak: number;
  current_streak: number;
}

// Тип для версии API
export interface VersionResponse {
  version: string;
}

// Типы для контекста аутентификации
export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  loading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<boolean>;
}
