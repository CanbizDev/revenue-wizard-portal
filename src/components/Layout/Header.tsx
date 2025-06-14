
import React from 'react';
import { User, LogOut, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  portalType: 'admin' | 'seller' | 'client';
  user?: {
    name: string;
    email: string;
    role: string;
    company?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ portalType, user }) => {
  const getPortalTitle = () => {
    switch (portalType) {
      case 'admin':
        return 'JB Admin Portal';
      case 'seller':
        return 'Seller Portal';
      case 'client':
        return 'Client Portal';
      default:
        return 'ReportingPortal.ai';
    }
  };

  const getPortalBadge = () => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      seller: 'bg-blue-100 text-blue-800',
      client: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={colors[portalType]}>
        {portalType.toUpperCase()}
      </Badge>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">RP</span>
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-semibold text-gray-900">{getPortalTitle()}</h1>
            </div>
          </div>
          <div className="hidden sm:block">
            {getPortalBadge()}
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="sm:hidden">
            {getPortalBadge()}
          </div>
          
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                </div>
                {user && (
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  {user?.company && (
                    <p className="text-xs text-gray-400">{user.company}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
