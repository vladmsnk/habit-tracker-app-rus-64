
import { ApiErrorDetails, ApiErrorResponse } from "@/types";

export class ApiErrorHandler {
  static async formatErrorMessage(error: unknown): Promise<ApiErrorDetails> {
    // Время возникновения ошибки
    const timestamp = new Date().toISOString();
    
    // Базовый объект ошибки
    const errorDetails: ApiErrorDetails = {
      message: "Неизвестная ошибка",
      timestamp
    };
    
    try {
      // Если ошибка - объект Error
      if (error instanceof Error) {
        errorDetails.message = error.message || "Неизвестная ошибка";
        errorDetails.originalError = error;
        
        // Извлекаем дополнительную информацию из Response, если доступна
        if ((error as any).response) {
          const response = (error as any).response;
          errorDetails.status = response.status;
          errorDetails.statusText = response.statusText;
          errorDetails.url = response.url;
          errorDetails.method = response.config?.method?.toUpperCase();
          
          // Если есть тело ответа, попробуем его распарсить
          try {
            const responseBody = await this.tryGetResponseText(response);
            errorDetails.responseBody = responseBody;
            
            // Пытаемся распарсить JSON
            try {
              const jsonData = JSON.parse(responseBody) as ApiErrorResponse;
              if (jsonData.error || jsonData.message) {
                errorDetails.message = jsonData.error || jsonData.message || errorDetails.message;
                errorDetails.errorCode = typeof jsonData.status === 'string' ? jsonData.status : undefined;
                if (jsonData.details) {
                  errorDetails.originalError = jsonData.details;
                }
              }
            } catch {
              // Если не удалось распарсить как JSON, используем текст как есть
            }
          } catch {
            // Игнорируем ошибки при получении тела ответа
          }
        }
        
        // Добавляем статус, если он есть
        if ((error as any).status && !errorDetails.status) {
          errorDetails.status = (error as any).status;
        }
        
        // Добавляем URL, если он есть
        if ((error as any).url && !errorDetails.url) {
          errorDetails.url = (error as any).url;
        }
        
        // Добавляем метод, если он есть
        if ((error as any).method && !errorDetails.method) {
          errorDetails.method = (error as any).method;
        }
      } else if (typeof error === 'string') {
        // Если ошибка - просто строка
        errorDetails.message = error;
        
        // Пытаемся распарсить JSON строку
        try {
          const jsonData = JSON.parse(error) as ApiErrorResponse;
          if (jsonData.error || jsonData.message) {
            errorDetails.message = jsonData.error || jsonData.message || error;
            errorDetails.responseBody = error;
            errorDetails.originalError = jsonData;
          }
        } catch {
          // Если не удалось распарсить как JSON, используем текст как есть
        }
      } else if (error && typeof error === 'object') {
        // Если ошибка - неизвестный объект, преобразуем его в строку
        errorDetails.originalError = error;
        
        // Пытаемся получить известные поля
        const anyError = error as any;
        
        if (anyError.message) {
          errorDetails.message = anyError.message;
        } else if (anyError.error) {
          errorDetails.message = anyError.error;
        }
        
        if (anyError.status) {
          errorDetails.status = anyError.status;
        }
        
        if (anyError.statusText) {
          errorDetails.statusText = anyError.statusText;
        }
        
        if (anyError.url) {
          errorDetails.url = anyError.url;
        }
        
        if (anyError.method) {
          errorDetails.method = anyError.method;
        }
        
        // Если есть data, это может быть response body
        if (anyError.data) {
          try {
            errorDetails.responseBody = typeof anyError.data === 'string' 
              ? anyError.data 
              : JSON.stringify(anyError.data);
          } catch {}
        }
      }
    } catch (parseError) {
      console.error("Ошибка при форматировании ошибки:", parseError);
    }
    
    return errorDetails;
  }
  
  // Вспомогательный метод для получения текста ответа
  private static async tryGetResponseText(response: any): Promise<string> {
    try {
      // Пробуем получить тело ответа различными способами
      if (response.data) {
        if (typeof response.data === 'string') {
          return response.data;
        }
        return JSON.stringify(response.data);
      }
      
      if (response.text && typeof response.text === 'function') {
        return await response.text();
      }
      
      if (response.json && typeof response.json === 'function') {
        const jsonData = await response.json();
        return JSON.stringify(jsonData);
      }
      
      return "Не удалось получить содержимое ответа";
    } catch (error) {
      return `Ошибка при получении содержимого ответа: ${error}`;
    }
  }
  
  static getStatusText(status?: number): string {
    if (!status) return '';
    
    switch (status) {
      case 400: return 'Некорректный запрос';
      case 401: return 'Не авторизован';
      case 403: return 'Доступ запрещен';
      case 404: return 'Не найдено';
      case 409: return 'Конфликт';
      case 422: return 'Ошибка валидации';
      case 500: return 'Ошибка сервера';
      default: return `Код ошибки: ${status}`;
    }
  }
  
  static getErrorTitle(error: ApiErrorDetails): string {
    if (error.status) {
      return `${this.getStatusText(error.status)} (${error.status})`;
    }
    return 'Ошибка';
  }
  
  static getFullErrorDescription(error: ApiErrorDetails): string {
    const parts: string[] = [];
    
    // Если есть метод и URL, формируем информацию о запросе
    if (error.method && error.url) {
      parts.push(`Метод: ${error.method} ${error.url}`);
    }
    
    // Если есть статус, добавляем его
    if (error.status) {
      parts.push(`Статус: ${error.status} ${this.getStatusText(error.status)}`);
    }
    
    // Добавляем сообщение об ошибке
    parts.push(`Сообщение: ${error.message}`);
    
    // Если есть тело ответа, добавляем его
    if (error.responseBody) {
      parts.push(`Ответ: ${error.responseBody}`);
    }
    
    // Добавляем время возникновения ошибки
    if (error.timestamp) {
      parts.push(`Время: ${new Date(error.timestamp).toLocaleString()}`);
    }
    
    return parts.join('\n');
  }
}
