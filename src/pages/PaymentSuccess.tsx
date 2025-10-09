import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoiceNumber, amount } = location.state || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {invoiceNumber && (
            <p className="text-muted-foreground">
              Invoice #{invoiceNumber} has been paid successfully.
            </p>
          )}
          {amount && (
            <p className="text-lg font-semibold">
              Amount: ${(amount / 100).toFixed(2)} USD
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            You will receive a confirmation email shortly.
          </p>
          <Button 
            onClick={() => navigate(-1)} 
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
