import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon: LucideIcon;
  format?: 'currency' | 'percentage' | 'number';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  format = 'number'
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const isPositiveChange = change && change.value > 0;
  const TrendIcon = isPositiveChange ? TrendingUp : TrendingDown;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {formatValue(value)}
        </div>
        {change && (
          <div className="flex items-center space-x-1 mt-1">
            <TrendIcon 
              className={`h-3 w-3 ${
                isPositiveChange ? 'text-green-600' : 'text-red-600'
              }`} 
            />
            <span 
              className={`text-xs ${
                isPositiveChange ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {Math.abs(change.value)}% from {change.period}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;