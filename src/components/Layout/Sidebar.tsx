
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Users, 
  BarChart3, 
  Settings, 
  FileText, 
  DollarSign, 
  Building2,
  UserPlus,
  CreditCard,
  History,
  Eye,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  portalType: 'admin' | 'seller' | 'client' | 'tier1-seller';
  userRole?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ portalType, userRole, activeTab, onTabChange, isOpen = true, onToggle }) => {
  const isMobile = useIsMobile();
  const getMenuItems = () => {
    switch (portalType) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'tier1-sellers', label: 'Tier-1 Sellers', icon: Building2 },
          { id: 'tier2-sellers', label: 'Tier-2 Sellers', icon: Users },
          { id: 'subscription-plans', label: 'Subscription Plans', icon: CreditCard },
          { id: 'revenue', label: 'Revenue Overview', icon: DollarSign },
          { id: 'settings', label: 'Global Settings', icon: Settings },
        ];
      
      case 'seller':
        const sellerItems = [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'projects', label: 'Project Management', icon: Building2 },
          { id: 'subscription-plans', label: 'Subscription Plans', icon: CreditCard },
          { id: 'billing', label: 'Billing & Revenue', icon: DollarSign },
          { id: 'reports', label: 'Reports', icon: FileText },
        ];
        
        if (userRole === 'tier1_seller') {
          sellerItems.splice(1, 0, { id: 'tier2-sellers', label: 'Tier-2 Sellers', icon: Building2 });
        }
        
        return sellerItems;
      
      case 'tier1-seller':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'tier2-sellers', label: 'Tier-2 Sellers', icon: Users },
          { id: 'clients', label: 'Clients', icon: Users },
          { id: 'projects', label: 'Projects', icon: Building2 },
          { id: 'revenue', label: 'Revenue', icon: DollarSign },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      
      case 'client':
        const clientItems = [
          { id: 'projects', label: 'Projects', icon: BarChart3 },
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'reports', label: 'Current Reports', icon: FileText },
          { id: 'history', label: 'Report History', icon: History },
          { id: 'billing', label: 'Billing', icon: CreditCard },
        ];
        
        if (userRole === 'client_admin') {
          clientItems.splice(4, 0, { id: 'users', label: 'User Management', icon: Users });
        }
        
        return clientItems;
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onToggle}
          />
        )}
        
        {/* Mobile sidebar */}
        <aside className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-md">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-4 px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onTabChange(item.id);
                        onToggle?.();
                      }}
                      className={cn(
                        'w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      </>
    );
  }

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-full">
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
