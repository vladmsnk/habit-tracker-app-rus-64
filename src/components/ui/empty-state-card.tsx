
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface EmptyStateCardProps {
  title: string;
  description: string;
  actionLabel: ReactNode;
  onAction: () => void;
  icon?: ReactNode;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <Card className="shadow-md border-dashed border-2 bg-background/50">
      <CardContent className="flex flex-col items-center justify-center text-center py-10 px-4">
        {icon ? (
          <div className="rounded-full bg-muted p-3 mb-4">{icon}</div>
        ) : (
          <div className="h-12 w-12 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center mb-4">
            <ChevronRight className="h-6 w-6 text-muted-foreground/70" />
          </div>
        )}

        <h3 className="text-xl font-semibold mt-2">{title}</h3>
        <p className="text-muted-foreground mt-1 mb-6 max-w-md">{description}</p>

        <Button onClick={onAction} className="animate-pulse-slow">
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyStateCard;
