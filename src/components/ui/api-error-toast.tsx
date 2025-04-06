
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ApiErrorHandler } from '@/utils/errorHandler';
import { Separator } from '@/components/ui/separator';

interface ApiErrorToastProps {
  error: unknown;
  context?: string;
}

export const showApiErrorToast = async (error: unknown, context?: string) => {
  const formattedError = await ApiErrorHandler.formatErrorMessage(error);
  const contextPrefix = context ? `${context}: ` : '';
  
  toast({
    variant: "destructive",
    title: `${contextPrefix}${ApiErrorHandler.getErrorTitle(formattedError)}`,
    description: (
      <Alert variant="destructive" className="mt-2">
        <AlertTitle>Подробная информация об ошибке:</AlertTitle>
        <AlertDescription className="space-y-2 break-words text-sm">
          <div className="whitespace-pre-line">
            {ApiErrorHandler.getFullErrorDescription(formattedError)}
          </div>
          
          {formattedError.responseBody && (
            <>
              <Separator className="my-2" />
              <div>
                <h4 className="text-xs font-semibold mb-1">Полное содержимое ответа:</h4>
                <div className="p-2 bg-destructive/10 rounded text-destructive overflow-auto max-h-40 text-xs">
                  <pre>{formattedError.responseBody}</pre>
                </div>
              </div>
            </>
          )}
          
          {formattedError.originalError && typeof formattedError.originalError === 'object' && (
            <>
              <Separator className="my-2" />
              <details className="text-xs">
                <summary className="cursor-pointer font-semibold">Технические детали</summary>
                <pre className="mt-2 p-2 bg-destructive/10 rounded text-destructive overflow-auto max-h-40">
                  {JSON.stringify(formattedError.originalError, null, 2)}
                </pre>
              </details>
            </>
          )}
        </AlertDescription>
      </Alert>
    ),
  });
};

const ApiErrorToast: React.FC<ApiErrorToastProps> = ({ error, context }) => {
  React.useEffect(() => {
    showApiErrorToast(error, context);
  }, [error, context]);
  
  return null;
};

export default ApiErrorToast;
