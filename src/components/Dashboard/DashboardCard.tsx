
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className = ''
}) => {
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
      </CardHeader>
      <CardContent>
        <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mb-2">
            {description}
          </p>
        )}
        {trend && (
          <div className={`text-xs flex items-center ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className={`mr-1 ${trend.isPositive ? '↗' : '↘'}`}>
              {trend.isPositive ? '↗' : '↘'}
            </span>
            {Math.abs(trend.value)}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
