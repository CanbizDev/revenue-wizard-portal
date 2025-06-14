
import React from 'react';
import { cn } from '@/lib/utils';
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
  Eye
} from 'lucide-react';

interface SidebarProps {
  portalType: 'admin' | 'seller' | 'client';
  userRole?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ portalType, userRole, activeTab, onTabChange }) => {
  const getMenuItems = () => {
    switch (portalType) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'tier1-sellers', label: 'Tier-1 Sellers', icon: Building2 },
          { id: 'tier2-sellers', label: 'Tier-2 Sellers', icon: Users },
          { id: 'clients', label: 'Clients', icon: UserPlus },
          { id: 'revenue', label: 'Revenue Overview', icon: DollarSign },
          { id: 'settings', label: 'Global Settings', icon: Settings },
        ];
      
      case 'seller':
        const sellerItems = [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'clients', label: 'My Clients', icon: Users },
          { id: 'billing', label: 'Billing & Revenue', icon: DollarSign },
          { id: 'reports', label: 'Reports', icon: FileText },
        ];
        
        if (userRole === 'tier1_seller') {
          sellerItems.splice(2, 0, { id: 'tier2-sellers', label: 'Tier-2 Sellers', icon: Building2 });
        }
        
        return sellerItems;
      
      case 'client':
        const clientItems = [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'reports', label: 'Current Reports', icon: FileText },
          { id: 'history', label: 'Report History', icon: History },
          { id: 'billing', label: 'Billing', icon: CreditCard },
        ];
        
        if (userRole === 'client_admin') {
          clientItems.splice(3, 0, { id: 'users', label: 'User Management', icon: Users });
        }
        
        return clientItems;
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

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
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
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
