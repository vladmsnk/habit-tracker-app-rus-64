
interface ApiError {
  status?: number;
  message: string;
  originalError?: unknown;
}

export class ApiErrorHandler {
  static formatErrorMessage(error: unknown): ApiError {
    if (error instanceof Error) {
      const apiError: ApiError = {
        message: error.message || 'Неизвестная ошибка',
      };
      
      // Добавляем статус, если он есть
      if ((error as any).status) {
        apiError.status = (error as any).status;
      }
      
      // Сохраняем оригинальную ошибку
      apiError.originalError = error;
      
      return apiError;
    }
    
    // Для строк или других типов
    if (typeof error === 'string') {
      return { message: error };
    }
    
    return { message: 'Произошла неизвестная ошибка', originalError: error };
  }
  
  static getStatusText(status?: number): string {
    if (!status) return '';
    
    switch (status) {
      case 400: return 'Некорректный запрос';
      case 401: return 'Не авторизован';
      case 403: return 'Доступ запрещен';
      case 404: return 'Не найдено';
      case 409: return 'Конфликт';
      case 500: return 'Ошибка сервера';
      default: return `Код ошибки: ${status}`;
    }
  }
  
  static getErrorTitle(error: ApiError): string {
    if (error.status) {
      return `${this.getStatusText(error.status)} (${error.status})`;
    }
    return 'Ошибка';
  }
  
  static getFullErrorDescription(error: ApiError): string {
    const statusText = error.status ? `${this.getStatusText(error.status)}` : '';
    return `${statusText}${statusText ? ': ' : ''}${error.message}`;
  }
}
