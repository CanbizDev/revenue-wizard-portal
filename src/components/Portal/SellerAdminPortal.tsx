import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SellerAdminPortalProps {
  company: 'marketstrendai' | 'xyzseller';
  onNavigate: (path: string) => void;
}

const SellerAdminPortal: React.FC<SellerAdminPortalProps> = ({ company, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Seller Admin Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Seller admin portal - API integration pending for company: {company}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerAdminPortal;