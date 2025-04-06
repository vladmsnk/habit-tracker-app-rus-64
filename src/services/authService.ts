
import { API_BASE_URL, handleResponse } from "./apiConfig";
import { LoginRequest, LoginResponse, RegisterRequest, RefreshTokenRequest, LogoutRequest } from "@/types";

export const authService = {
  // Register user
  register: async (data: RegisterRequest): Promise<string> => {
    const url = `${API_BASE_URL}/auth/register`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return handleResponse(response, { method: "POST", url });
  },

  // Login user
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const url = `${API_BASE_URL}/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    // Ожидается, что сервер возвращает объект вида:
    // { token: { access_token: string, refresh_token: string } }
    const result = await handleResponse(response, { method: "POST", url });
    return result.token;
  },

  // Refresh token
  refreshToken: async (data: RefreshTokenRequest): Promise<{ access_token: string, refresh_token: string }> => {
    const url = `${API_BASE_URL}/auth/refresh`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return handleResponse(response, { method: "POST", url });
  },

  // Logout
  logout: async (data: LogoutRequest): Promise<string> => {
    const url = `${API_BASE_URL}/auth/logout`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return handleResponse(response, { method: "POST", url });
  },
};
