
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingCardsProps {
  count?: number;
}

const LoadingCards: React.FC<LoadingCardsProps> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border p-6 space-y-4 card-gradient-primary">
          <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
          <div className="h-2 bg-muted rounded animate-pulse w-full mt-4"></div>
          <div className="flex justify-between pt-4">
            <div className="h-9 bg-muted rounded animate-pulse w-20"></div>
            <div className="h-9 bg-muted rounded animate-pulse w-20"></div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LoadingCards;
