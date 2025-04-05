
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CreateHabitRequest, Habit } from "@/types";
import { Plus } from "lucide-react";
import HabitCard from "@/components/habits/HabitCard";
import CreateHabitForm from "@/components/habits/CreateHabitForm";
import AlertConfirmation from "@/components/ui/alert-confirmation";
import PageHeader from "@/components/layout/PageHeader";
import EmptyStateCard from "@/components/ui/empty-state-card";
import LoadingCards from "@/components/ui/loading-cards";
import { useHabits } from "@/hooks/useHabits";
import { useTime } from "@/hooks/useTime";

const HomePage: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editHabitData, setEditHabitData] = useState<Habit | undefined>(undefined);
  const [deleteHabitId, setDeleteHabitId] = useState<number | null>(null);
  const { isAuthenticated } = useAuth();
  const { 
    habits, 
    loading: habitsLoading, 
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    addProgress 
  } = useHabits();
  const { 
    currentTime, 
    loading: timeLoading, 
    getCurrentTime 
  } = useTime();

  // Load data when component mounts or user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchHabits();
      getCurrentTime();
    }
  }, [isAuthenticated]);

  // Handle habit creation
  const handleCreateHabit = async (habitData: CreateHabitRequest) => {
    const success = await createHabit(habitData);
    if (success) {
      setCreateDialogOpen(false);
    }
  };

  // Handle habit update
  const handleUpdateHabit = async (habitData: CreateHabitRequest) => {
    if (!editHabitData) return;
    
    const updateData = {
      ...habitData,
      id: editHabitData.id
    };
    
    const success = await updateHabit(updateData);
    if (success) {
      setEditHabitData(undefined);
    }
  };

  // Handle habit deletion
  const handleDeleteHabit = async () => {
    if (!deleteHabitId) return;
    
    const success = await deleteHabit(deleteHabitId);
    if (success) {
      setDeleteHabitId(null);
    }
  };

  // Handle page refresh
  const handleRefresh = () => {
    fetchHabits();
    getCurrentTime();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Мои привычки"
        description="Управляйте своими привычками и отслеживайте прогресс"
        actionLabel={<><Plus className="h-4 w-4 mr-2" />Добавить привычку</>}
        onAction={() => setCreateDialogOpen(true)}
        currentTime={currentTime}
        loading={timeLoading}
        onRefresh={handleRefresh}
      />

      {/* Display habits list */}
      {habitsLoading ? (
        <LoadingCards count={3} />
      ) : habits.length === 0 ? (
        <EmptyStateCard 
          title="У вас пока нет привычек"
          description="Создайте свою первую привычку, чтобы начать отслеживать прогресс"
          actionLabel={<><Plus className="h-4 w-4 mr-2" />Добавить привычку</>}
          onAction={() => setCreateDialogOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={(habit) => setEditHabitData(habit)}
              onDelete={(habitId) => setDeleteHabitId(habitId)}
              onAddProgress={addProgress}
            />
          ))}
        </div>
      )}

      {/* Habit creation/editing form */}
      <CreateHabitForm
        open={createDialogOpen || !!editHabitData}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditHabitData(undefined);
          }
        }}
        onSubmit={editHabitData ? handleUpdateHabit : handleCreateHabit}
        initialData={editHabitData}
        isEditing={!!editHabitData}
      />

      {/* Deletion confirmation dialog */}
      <AlertConfirmation
        open={!!deleteHabitId}
        onOpenChange={(open) => !open && setDeleteHabitId(null)}
        title="Удаление привычки"
        description="Вы уверены, что хотите удалить эту привычку? Это действие невозможно отменить."
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        onConfirm={handleDeleteHabit}
        destructive
      />
    </div>
  );
};

export default HomePage;
