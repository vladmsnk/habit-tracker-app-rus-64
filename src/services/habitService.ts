
import { API_BASE_URL, handleResponse } from "./apiConfig";
import { CreateHabitRequest, UpdateHabitRequest, HabitListResponse, Progress } from "@/types";

export const habitService = {
  // GET /tracker/habits
  listHabits: async (token: string): Promise<HabitListResponse> => {
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
  listCompletedHabits: async (token: string): Promise<HabitListResponse> => {
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
  getProgress: async (habitId: number, token: string): Promise<Progress> => {
    console.log(`Fetching progress for habit ${habitId}`);
    const response = await fetch(`${API_BASE_URL}/tracker/progress/${habitId}`, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    const data = await handleResponse(response);
    console.log("Progress API response:", data);
    return data;
  },

  // POST /tracker/progress/{habitId}
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
  getReminders: async (token: string): Promise<any> => {
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
