
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { CreateHabitRequest, FrequencyType, Habit } from "@/types";
import { Loader2 } from "lucide-react";

interface CreateHabitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (habit: CreateHabitRequest) => Promise<void>;
  initialData?: Habit;
  isEditing?: boolean;
}

const CreateHabitForm: React.FC<CreateHabitFormProps> = ({ 
  open, 
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const [description, setDescription] = useState(initialData?.description || "");
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(
    initialData?.goal.frequency_type || "daily"
  );
  const [timesPerFrequency, setTimesPerFrequency] = useState(
    initialData?.goal.times_per_frequency?.toString() || "1"
  );
  const [totalTrackingPeriods, setTotalTrackingPeriods] = useState(
    initialData?.goal.total_tracking_periods?.toString() || "30"
  );
  const [errors, setErrors] = useState<{
    description?: string;
    timesPerFrequency?: string;
    totalTrackingPeriods?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  // Сброс формы при закрытии
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  // Сброс формы к исходным значениям
  const resetForm = () => {
    if (!isEditing) {
      setDescription("");
      setFrequencyType("daily");
      setTimesPerFrequency("1");
      setTotalTrackingPeriods("30");
    } else {
      setDescription(initialData?.description || "");
      setFrequencyType(initialData?.goal.frequency_type || "daily");
      setTimesPerFrequency(initialData?.goal.times_per_frequency?.toString() || "1");
      setTotalTrackingPeriods(initialData?.goal.total_tracking_periods?.toString() || "30");
    }
    setErrors({});
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors: {
      description?: string;
      timesPerFrequency?: string;
      totalTrackingPeriods?: string;
    } = {};
    let isValid = true;

    if (!description.trim()) {
      newErrors.description = "Введите название привычки";
      isValid = false;
    } else if (description.length > 80) {
      newErrors.description = "Название привычки должно быть не более 80 символов";
      isValid = false;
    }

    const timesValue = parseInt(timesPerFrequency);
    if (isNaN(timesValue) || timesValue < 1 || timesValue > 100) {
      newErrors.timesPerFrequency = "Значение должно быть от 1 до 100";
      isValid = false;
    }

    const periodsValue = parseInt(totalTrackingPeriods);
    if (isNaN(periodsValue) || periodsValue < 1 || periodsValue > 1000) {
      newErrors.totalTrackingPeriods = "Значение должно быть от 1 до 1000";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const habitData: CreateHabitRequest = {
      description,
      goal: {
        frequency_type: frequencyType,
        times_per_frequency: parseInt(timesPerFrequency),
        total_tracking_periods: parseInt(totalTrackingPeriods)
      }
    };

    try {
      await onSubmit(habitData);
      handleOpenChange(false);
    } catch (error) {
      console.error("Ошибка при создании привычки:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Редактирование привычки" : "Создание новой привычки"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Измените параметры вашей привычки" 
              : "Заполните форму для создания новой привычки"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Название привычки</Label>
            <Input
              id="description"
              placeholder="Например: Ежедневная прогулка"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-destructive text-sm">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency-type">Частота выполнения</Label>
            <Select 
              value={frequencyType} 
              onValueChange={(value) => setFrequencyType(value as FrequencyType)}
            >
              <SelectTrigger id="frequency-type">
                <SelectValue placeholder="Выберите частоту" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Ежедневно</SelectItem>
                <SelectItem value="weekly">Еженедельно</SelectItem>
                <SelectItem value="monthly">Ежемесячно</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="times-per-frequency">Количество раз за период</Label>
            <Input
              id="times-per-frequency"
              type="number"
              min="1"
              max="100"
              placeholder="1"
              value={timesPerFrequency}
              onChange={(e) => setTimesPerFrequency(e.target.value)}
              className={errors.timesPerFrequency ? "border-destructive" : ""}
            />
            {errors.timesPerFrequency && (
              <p className="text-destructive text-sm">{errors.timesPerFrequency}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="total-tracking-periods">Количество периодов отслеживания</Label>
            <Input
              id="total-tracking-periods"
              type="number"
              min="1"
              max="1000"
              placeholder="30"
              value={totalTrackingPeriods}
              onChange={(e) => setTotalTrackingPeriods(e.target.value)}
              className={errors.totalTrackingPeriods ? "border-destructive" : ""}
            />
            {errors.totalTrackingPeriods && (
              <p className="text-destructive text-sm">{errors.totalTrackingPeriods}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Сохранение..." : "Создание..."}
                </>
              ) : (
                isEditing ? "Сохранить" : "Создать"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateHabitForm;
