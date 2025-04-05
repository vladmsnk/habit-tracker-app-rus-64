
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: ReactNode;
  onAction?: () => void;
  currentTime?: string | null;
  loading?: boolean;
  onRefresh?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  currentTime,
  loading,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">
          {description}
          {currentTime && (
            <span className="text-sm ml-2 opacity-70">
              {loading ? "Загрузка времени..." : `Текущее время: ${currentTime}`}
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center space-x-2 sm:justify-self-end w-full sm:w-auto">
        {onRefresh && (
          <Button variant="outline" size="icon" onClick={onRefresh} className="shrink-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
        {actionLabel && onAction && (
          <Button onClick={onAction} className="w-full sm:w-auto">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
