
import { Button } from "@/components/ui/button";
import { Edit, Trash2, BarChart3, CheckCircle } from "lucide-react";

interface HabitActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onShowProgress: () => void;
  onAddProgress: () => void;
}

const HabitActions: React.FC<HabitActionsProps> = ({
  onEdit,
  onDelete,
  onShowProgress,
  onAddProgress
}) => {
  return (
    <div className="flex flex-wrap gap-2 pt-2 justify-between">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" />
          Изменить
        </Button>
        <Button size="sm" variant="outline" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Удалить
        </Button>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onShowProgress}>
          <BarChart3 className="h-4 w-4 mr-1" />
          Детали
        </Button>
        <Button 
          size="sm" 
          onClick={onAddProgress}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Отметить
        </Button>
      </div>
    </div>
  );
};

export default HabitActions;
