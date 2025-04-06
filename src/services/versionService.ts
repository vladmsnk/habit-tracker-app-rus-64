
import { API_BASE_URL, handleResponse } from "./apiConfig";
import { VersionResponse } from "@/types";

export const versionService = {
  getVersion: async (): Promise<VersionResponse> => {
    const url = `${API_BASE_URL}/version`;
    const response = await fetch(url, {
      method: "GET"
    });
    
    return handleResponse(response, { method: "GET", url });
  },
};
