
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <Card className="card-gradient-secondary p-8 mt-8 text-center rounded-lg">
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2">{description}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction} 
          className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default EmptyStateCard;
