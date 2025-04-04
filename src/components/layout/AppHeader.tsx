
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LogOut, Calendar, BarChart3, Home, MenuIcon, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import AlertConfirmation from "@/components/ui/alert-confirmation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Получаем инициалы пользователя для аватара
  const getUserInitials = () => {
    if (!user) return "?";
    return user.substring(0, 2).toUpperCase();
  };

  // Функция для проверки активного маршрута
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Навигационные ссылки
  const navLinks = [
    { 
      path: "/", 
      label: "Главная", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      path: "/completed", 
      label: "Завершенные", 
      icon: <BarChart3 className="h-5 w-5" /> 
    },
    { 
      path: "/time-control", 
      label: "Управление временем", 
      icon: <Calendar className="h-5 w-5" /> 
    }
  ];

  // Обработчик выхода из системы
  const handleLogout = async () => {
    await logout();
  };

  // Отображает кнопку для мобильной навигации
  const renderMobileMenuButton = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <div className="py-4 flex flex-col h-full">
          <div className="flex items-center mb-8">
            <div className="text-xl font-bold">
              TrackHabits
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button 
                  variant={isActive(link.path) ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto">
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive"
              onClick={() => {
                setMobileMenuOpen(false);
                setLogoutDialogOpen(true);
              }}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur border-b border-b-border">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Мобильная навигация */}
        {renderMobileMenuButton()}
        
        {/* Логотип */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            TrackHabits
          </Link>
        </div>

        {/* Навигация для десктопа */}
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button 
                variant={isActive(link.path) ? "default" : "ghost"}
                className="flex items-center"
              >
                {link.icon}
                <span className="ml-2">{link.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Профиль пользователя */}
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user && <DropdownMenuLabel>{user}</DropdownMenuLabel>}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => setLogoutDialogOpen(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Диалог подтверждения выхода */}
      <AlertConfirmation
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Выход из системы"
        description="Вы уверены, что хотите выйти из системы?"
        confirmLabel="Выйти"
        cancelLabel="Отмена"
        onConfirm={handleLogout}
        destructive
      />
    </header>
  );
};

export default AppHeader;
