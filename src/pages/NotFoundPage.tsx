
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl md:text-8xl font-bold text-primary">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mt-4">Страница не найдена</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        Страница, которую вы ищете, не существует или была перемещена.
      </p>
      <Link to="/">
        <Button className="mt-8">
          <Home className="mr-2 h-4 w-4" />
          Вернуться на главную
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
