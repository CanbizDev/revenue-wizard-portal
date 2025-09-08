import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ServiceControlPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Control Panel</h2>
        <p className="text-gray-600">Manage system settings and configurations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Service control panel - API integration pending
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceControlPanel;