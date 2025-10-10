import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle className="flex flex-col items-center justify-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          Payment Successful!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">
          Thank you! Your payment has been processed successfully.
        </p>
        <Button asChild>
          <Link to="/seller-admin">Back to Dashboard</Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default PaymentSuccess;