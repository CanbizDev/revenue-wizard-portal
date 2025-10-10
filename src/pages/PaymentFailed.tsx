import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const PaymentFailed: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle className="flex flex-col items-center justify-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          Payment Failed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">
          Unfortunately, we were unable to process your payment. Please check your card details and try again.
        </p>
        <Button asChild variant="outline">
          <Link to="/seller-admin">Back to Billing</Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default PaymentFailed;