const API_BASE_URL = "http://127.0.0.1:8081/api/v1";

// Helper function for handling API responses
export const handleResponse = async (response: Response, requestInfo?: { method: string, url: string }) => {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMessage;
    let responseText;

    try {
      responseText = await response.text();
      
      if (contentType && contentType.includes("application/json") && responseText) {
        try {
          const error = JSON.parse(responseText);
          errorMessage = error.message || error.error || response.statusText;
        } catch {
          errorMessage = responseText || response.statusText;
        }
      } else {
        errorMessage = responseText || response.statusText;
      }
    } catch {
      errorMessage = response.statusText;
    }

    const error = new Error(errorMessage);
    
    // Расширяем объект ошибки дополнительной информацией
    (error as any).status = response.status;
    (error as any).statusText = response.statusText;
    (error as any).url = requestInfo?.url || response.url;
    (error as any).method = requestInfo?.method || 'GET';
    (error as any).responseBody = responseText;
    
    throw error;
  }

  // Return true for empty responses
  if (response.status === 204) {
    return true;
  }

  if (contentType && contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (jsonError) {
      console.warn("Не удалось распарсить JSON ответ:", jsonError);
      return await response.text();
    }
  }

  return await response.text();
};

export { API_BASE_URL };
