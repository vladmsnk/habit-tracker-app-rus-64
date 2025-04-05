
import { API_BASE_URL, handleResponse } from "./apiConfig";
import { CreateHabitRequest, UpdateHabitRequest, HabitListResponse } from "@/types";

export const habitService = {
  // List habits
  listHabits: async (token: string): Promise<HabitListResponse> => {
    const response = await fetch(`${API_BASE_URL}/tracker/habits`, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },

  // List completed habits
  listCompletedHabits: async (token: string): Promise<HabitListResponse> => {
    const response = await fetch(`${API_BASE_URL}/tracker/habits/completed`, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },

  // Create habit
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

  // Update habit
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

  // Delete habit
  deleteHabit: async (habitId: number, token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/tracker/habits/${habitId}`, {
      method: "DELETE",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },
  
  // Get progress
  getProgress: async (habitId: number, token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/tracker/progress/${habitId}`, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },

  // Add progress
  addProgress: async (habitId: number, token: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/tracker/progress/${habitId}`, {
      method: "POST",
      headers: {
        "Authorization": token
      }
    });
    
    return handleResponse(response);
  },

  // Get reminders
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
