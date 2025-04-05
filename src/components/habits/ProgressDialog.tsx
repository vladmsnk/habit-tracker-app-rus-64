
import { Progress, Habit } from "@/types";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface ProgressDialogProps {
  habit: Habit;
  progress: Progress | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProgress: () => void;
}

const ProgressDialog: React.FC<ProgressDialogProps> = ({
  habit,
  progress,
  open,
  onOpenChange,
  onAddProgress
}) => {
  // Отладочная информация
  console.log("Progress data in dialog:", progress);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader>
          <DialogTitle className="text-xl">Детали прогресса</DialogTitle>
          <DialogDescription>
            Подробная статистика вашего прогресса по привычке "{habit.description}"
          </DialogDescription>
        </DialogHeader>
        
        {progress ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <p className="text-xs text-muted-foreground">Всего выполнено периодов</p>
                <p className="text-2xl font-bold text-primary">{progress.total_completed_periods}</p>
                <p className="text-xs text-muted-foreground">из {habit.goal.total_tracking_periods}</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <p className="text-xs text-muted-foreground">Текущая серия</p>
                <p className="text-2xl font-bold text-primary">{progress.current_streak}</p>
                <p className="text-xs text-muted-foreground">периодов подряд</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <p className="text-xs text-muted-foreground">Лучшая серия</p>
                <p className="text-2xl font-bold text-primary">{progress.most_longest_streak}</p>
                <p className="text-xs text-muted-foreground">периодов подряд</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <p className="text-xs text-muted-foreground">Пропущено периодов</p>
                <p className="text-2xl font-bold text-primary">{progress.total_skipped_periods}</p>
                <p className="text-xs text-muted-foreground">всего</p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={onAddProgress}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Отметить прогресс
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">Загрузка данных...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProgressDialog;
