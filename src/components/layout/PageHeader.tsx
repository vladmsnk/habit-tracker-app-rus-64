
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
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
  loading = false,
  onRefresh
}) => {
  return (
    <div className="card-gradient-primary p-6 rounded-lg shadow-lg mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
          {currentTime && (
            <div className="flex items-center text-sm text-primary mt-2">
              <Clock className="h-4 w-4 mr-1" />
              {loading ? "Загрузка..." : currentTime}
            </div>
          )}
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="glass-card border-primary/20"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          )}
          {actionLabel && onAction && (
            <Button 
              onClick={onAction} 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
