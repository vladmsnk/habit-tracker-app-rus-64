
import { API_BASE_URL, handleResponse } from "./apiConfig";
import { LoginRequest, LoginResponse, RegisterRequest, RefreshTokenRequest, LogoutRequest } from "@/types";

export const authService = {
  // Register user
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

  // Login user
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    // Ожидается, что сервер возвращает объект вида:
    // { token: { access_token: string, refresh_token: string } }
    const result = await handleResponse(response);
    return result.token;
  },

  // Refresh token
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

  // Logout
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
