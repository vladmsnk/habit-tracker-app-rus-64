
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ApiErrorHandler } from '@/utils/errorHandler';

interface ApiErrorToastProps {
  error: unknown;
}

export const showApiErrorToast = (error: unknown) => {
  const formattedError = ApiErrorHandler.formatErrorMessage(error);
  
  toast({
    variant: "destructive",
    title: ApiErrorHandler.getErrorTitle(formattedError),
    description: (
      <Alert variant="destructive" className="mt-2">
        <AlertTitle>Подробная информация:</AlertTitle>
        <AlertDescription className="break-words">
          {ApiErrorHandler.getFullErrorDescription(formattedError)}
          {formattedError.originalError && typeof formattedError.originalError === 'object' && (
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer">Технические детали</summary>
              <pre className="mt-2 max-h-40 overflow-auto p-2 bg-destructive/10 rounded text-destructive">
                {JSON.stringify(formattedError.originalError, null, 2)}
              </pre>
            </details>
          )}
        </AlertDescription>
      </Alert>
    ),
  });
};

const ApiErrorToast: React.FC<ApiErrorToastProps> = ({ error }) => {
  React.useEffect(() => {
    showApiErrorToast(error);
  }, [error]);
  
  return null;
};

export default ApiErrorToast;
