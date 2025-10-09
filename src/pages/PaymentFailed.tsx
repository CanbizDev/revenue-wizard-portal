import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailed() {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoiceNumber, error } = location.state || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {invoiceNumber && (
            <p className="text-muted-foreground">
              Payment for Invoice #{invoiceNumber} could not be processed.
            </p>
          )}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Please check your card details and try again.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => navigate(-1)} 
              className="w-full"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="outline"
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
