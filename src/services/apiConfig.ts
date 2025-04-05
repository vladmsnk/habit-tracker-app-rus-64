
const API_BASE_URL = "http://127.0.0.1:8081/api/v1";

// Helper function for handling API responses
export const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMessage;

    try {
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        errorMessage = error.message || response.statusText;
      } else {
        errorMessage = await response.text();
      }
    } catch {
      errorMessage = response.statusText;
    }

    const error = new Error(errorMessage);
    // Add status to handle 401 errors
    (error as any).status = response.status;
    throw error;
  }

  // Return true for empty responses
  if (response.status === 204) {
    return true;
  }

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export { API_BASE_URL };
