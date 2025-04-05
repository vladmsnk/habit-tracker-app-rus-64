
import { Progress } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface HabitProgressProps {
  progress: Progress | null;
  loading: boolean;
  totalTrackingPeriods: number;
}

const HabitProgress: React.FC<HabitProgressProps> = ({ 
  progress, 
  loading, 
  totalTrackingPeriods 
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!progress) {
    return <p className="text-sm text-muted-foreground">Данные о прогрессе недоступны</p>;
  }

  const { total_completed_periods } = progress;
  const completionPercentage = Math.min(
    Math.round((total_completed_periods / totalTrackingPeriods) * 100),
    100
  );

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Прогресс</span>
        <span className="text-sm font-bold">{completionPercentage}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-value" 
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{total_completed_periods} из {totalTrackingPeriods} периодов</span>
        {progress.current_streak > 0 && (
          <Badge variant="outline" className="flex items-center gap-1 bg-primary/10">
            <Trophy className="h-3 w-3 text-primary" />
            <span className="font-medium">Серия: {progress.current_streak}</span>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default HabitProgress;
