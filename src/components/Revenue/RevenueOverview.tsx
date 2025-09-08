import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RevenueOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Revenue Overview</h2>
        <p className="text-gray-600">Track and analyze revenue metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Revenue overview - API integration pending
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueOverview;