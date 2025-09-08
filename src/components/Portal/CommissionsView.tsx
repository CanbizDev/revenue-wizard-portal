import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CommissionsViewProps {
  userRole: 'tier1_seller' | 'tier2_seller';
  company: string;
}

const CommissionsView: React.FC<CommissionsViewProps> = ({ userRole, company }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Commissions</h2>
        <p className="text-gray-600">View your commission details and earnings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Commissions view - API integration pending
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionsView;