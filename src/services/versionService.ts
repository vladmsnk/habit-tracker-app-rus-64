
import { API_BASE_URL, handleResponse } from "./apiConfig";
import { VersionResponse } from "@/types";

export const versionService = {
  getVersion: async (): Promise<VersionResponse> => {
    const response = await fetch(`${API_BASE_URL}/version`, {
      method: "GET"
    });
    
    return handleResponse(response);
  },
};
