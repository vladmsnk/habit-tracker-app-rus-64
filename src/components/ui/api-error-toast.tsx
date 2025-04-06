
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ApiErrorHandler } from '@/utils/errorHandler';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface ApiErrorToastProps {
  error: unknown;
  context?: string;
}

export const showApiErrorToast = async (error: unknown, context?: string) => {
  const formattedError = await ApiErrorHandler.formatErrorMessage(error);
  const contextPrefix = context ? `${context}: ` : '';
  const title = `${contextPrefix}${ApiErrorHandler.getErrorTitle(formattedError)}`;
  const mainMessage = formattedError.message || 'Неизвестная ошибка';
  
  toast({
    variant: "destructive",
    title: (
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span className="font-medium">{title}</span>
      </div>
    ),
    description: (
      <div className="mt-1 text-sm space-y-2">
        <p className="font-medium">{mainMessage}</p>
        
        <Collapsible className="w-full">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {formattedError.method && formattedError.url && 
                `${formattedError.method} ${formattedError.url.split('/').slice(-2).join('/')}`}
            </p>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <span className="text-xs">Подробнее</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <div className="mt-2 space-y-2 rounded border border-destructive/20 p-2 bg-destructive/5 text-xs">
              {formattedError.method && formattedError.url && (
                <div className="flex flex-col">
                  <span className="font-semibold">Запрос:</span>
                  <code className="text-xs">{formattedError.method} {formattedError.url}</code>
                </div>
              )}
              
              {formattedError.status && (
                <div className="flex flex-col">
                  <span className="font-semibold">Статус:</span>
                  <code>{formattedError.status} {ApiErrorHandler.getStatusText(formattedError.status)}</code>
                </div>
              )}
              
              {formattedError.responseBody && (
                <div className="flex flex-col">
                  <span className="font-semibold">Ответ API:</span>
                  <code className="whitespace-pre-wrap break-all">{formattedError.responseBody}</code>
                </div>
              )}
              
              {formattedError.timestamp && (
                <div className="flex flex-col">
                  <span className="font-semibold">Время:</span>
                  <code>{new Date(formattedError.timestamp).toLocaleString()}</code>
                </div>
              )}
              
              {formattedError.originalError && typeof formattedError.originalError === 'object' && (
                <details className="text-xs mt-2">
                  <summary className="cursor-pointer font-semibold">Технические детали</summary>
                  <pre className="mt-1 p-2 bg-destructive/10 rounded overflow-auto max-h-32 text-[10px]">
                    {JSON.stringify(formattedError.originalError, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
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
