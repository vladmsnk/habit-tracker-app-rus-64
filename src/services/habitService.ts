
import { API_BASE_URL, handleResponse } from "./apiConfig";
import { CreateHabitRequest, UpdateHabitRequest, HabitListResponse, Progress } from "@/types";

export const habitService = {
  // GET /tracker/habits
  listHabits: async (token: string): Promise<HabitListResponse> => {
    const url = `${API_BASE_URL}/tracker/habits`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    return handleResponse(response, { method: "GET", url });
  },

  // GET /tracker/habits/completed
  listCompletedHabits: async (token: string): Promise<HabitListResponse> => {
    const url = `${API_BASE_URL}/tracker/habits/completed`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    return handleResponse(response, { method: "GET", url });
  },

  // POST /tracker/habits
  createHabit: async (data: CreateHabitRequest, token: string): Promise<string> => {
    const url = `${API_BASE_URL}/tracker/habits`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response, { method: "POST", url });
  },

  // PUT /tracker/habits
  updateHabit: async (data: UpdateHabitRequest, token: string): Promise<string> => {
    const url = `${API_BASE_URL}/tracker/habits`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response, { method: "PUT", url });
  },

  // DELETE /tracker/habits/{habitId}
  deleteHabit: async (habitId: number, token: string): Promise<string> => {
    const url = `${API_BASE_URL}/tracker/habits/${habitId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    return handleResponse(response, { method: "DELETE", url });
  },

  // GET /tracker/progress/{habitId}
  getProgress: async (habitId: number, token: string): Promise<Progress> => {
    console.log(`Fetching progress for habit ${habitId}`);
    const url = `${API_BASE_URL}/tracker/progress/${habitId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    const data = await handleResponse(response, { method: "GET", url });
    console.log("Progress API response:", data);
    return data;
  },

  // POST /tracker/progress/{habitId}
  addProgress: async (habitId: number, token: string): Promise<string> => {
    const url = `${API_BASE_URL}/tracker/progress/${habitId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    return handleResponse(response, { method: "POST", url });
  },

  // GET /tracker/reminder
  getReminders: async (token: string): Promise<any> => {
    const url = `${API_BASE_URL}/tracker/reminder`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });
    return handleResponse(response, { method: "GET", url });
  },
};
