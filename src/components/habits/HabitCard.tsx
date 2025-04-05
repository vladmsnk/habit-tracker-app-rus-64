
import React, { useState, useEffect } from "react";
import { Habit } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import HabitProgress from "./HabitProgress";
import HabitActions from "./HabitActions";
import ProgressDialog from "./ProgressDialog";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: number) => void;
  onAddProgress: (habitId: number) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete, onAddProgress }) => {
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const { progress, loading, fetchProgress, addProgress } = useProgress(habit.id);

  useEffect(() => {
    fetchProgress();
  }, [habit.id]);

  // Function to format frequency type
  const formatFrequencyType = (type: string) => {
    switch (type) {
      case "daily":
        return "ежедневно";
      case "weekly":
        return "еженедельно";
      case "monthly":
        return "ежемесячно";
      default:
        return type;
    }
  };

  const handleAddProgress = async () => {
    const success = await addProgress();
    if (success) {
      onAddProgress(habit.id);
    }
  };

  return (
    <>
      <Card className="habit-card card-gradient-primary">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl truncate" title={habit.description}>
              {habit.description}
            </CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1 animate-fade-in">
              <Calendar className="h-3 w-3" />
              {formatFrequencyType(habit.goal.frequency_type)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {habit.goal.times_per_frequency} раз {formatFrequencyType(habit.goal.frequency_type)}
          </p>
        </CardHeader>
        <CardContent className="pb-2">
          <HabitProgress 
            progress={progress} 
            loading={loading} 
            totalTrackingPeriods={habit.goal.total_tracking_periods} 
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 pt-2 justify-between">
          <HabitActions 
            onEdit={() => onEdit(habit)}
            onDelete={() => onDelete(habit.id)}
            onShowProgress={() => setShowProgressDialog(true)}
            onAddProgress={handleAddProgress}
          />
        </CardFooter>
      </Card>

      <ProgressDialog 
        habit={habit}
        progress={progress}
        open={showProgressDialog}
        onOpenChange={setShowProgressDialog}
        onAddProgress={handleAddProgress}
      />
    </>
  );
};

export default HabitCard;
