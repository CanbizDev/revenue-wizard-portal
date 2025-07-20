import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';

interface CommissionsViewProps {
  userRole: 'tier1_seller' | 'tier2_seller';
}

const CommissionsView: React.FC<CommissionsViewProps> = ({ userRole }) => {
  // Mock data - in real app, this would come from the database
  const commissionData = {
    commissionType: 'percentage' as 'percentage' | 'fixed',
    commissionValue: userRole === 'tier1_seller' ? 15 : 10,
    totalDue: userRole === 'tier1_seller' ? 67500 : 28500,
    totalEarned: userRole === 'tier1_seller' ? 145000 : 62000,
    monthlyEarnings: userRole === 'tier1_seller' ? 22500 : 9500,
    pendingPayouts: userRole === 'tier1_seller' ? 3 : 2,
  };

  const recentCommissions = [
    {
      id: 1,
      client: 'DataFlow Inc',
      amount: 15000,
      type: 'Client Payment',
      date: '2024-01-15',
      status: 'paid'
    },
    {
      id: 2,
      client: 'Analytics Ltd',
      amount: 8500,
      type: 'Client Payment',
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: 3,
      client: 'TechStart Co',
      amount: 12000,
      type: 'Client Payment',
      date: '2024-01-12',
      status: 'paid'
    },
  ];

  if (userRole === 'tier1_seller') {
    recentCommissions.push({
      id: 4,
      client: 'Tier-2 Seller Commission',
      amount: 4500,
      type: 'Tier-2 Commission',
      date: '2024-01-13',
      status: 'paid'
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Commission Details</h2>
        <p className="text-gray-600">
          View your commission structure and earnings
        </p>
      </div>

      {/* Commission Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Percent className="h-5 w-5" />
            <span>Commission Structure</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Commission Type</label>
                <div className="mt-1">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {commissionData.commissionType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Commission Rate</label>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-green-600">
                    {commissionData.commissionType === 'percentage' 
                      ? `${commissionData.commissionValue}%` 
                      : `₹${commissionData.commissionValue.toLocaleString()}`
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Set By</label>
                <div className="mt-1">
                  <span className="text-sm text-gray-900">
                    {userRole === 'tier1_seller' ? 'Jupiter Brains Platform' : 'Tier-1 Seller'}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{commissionData.totalEarned.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Amount Due</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{commissionData.totalDue.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{commissionData.monthlyEarnings.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
                <p className="text-2xl font-bold text-purple-600">
                  {commissionData.pendingPayouts}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Commission History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Commission History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCommissions.map((commission) => (
              <div key={commission.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    commission.type === 'Tier-2 Commission' 
                      ? 'bg-purple-100' 
                      : 'bg-green-100'
                  }`}>
                    <DollarSign className={`h-5 w-5 ${
                      commission.type === 'Tier-2 Commission' 
                        ? 'text-purple-600' 
                        : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{commission.client}</h3>
                    <p className="text-sm text-gray-500">{commission.type} • {commission.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">
                    ₹{commission.amount.toLocaleString()}
                  </p>
                  <Badge 
                    variant={commission.status === 'paid' ? 'default' : 'secondary'}
                    className={commission.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {commission.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionsView;