import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  invoiceNumber: string;
  amount: number; // in cents
  onSuccess?: (invoiceNumber: string, amount: number) => void;
  onFailure?: (invoiceNumber: string, error: string) => void;
}

export const PaymentModal = ({ 
  isOpen, 
  onClose, 
  invoiceId, 
  invoiceNumber, 
  amount,
  onSuccess,
  onFailure 
}: PaymentModalProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast({
        title: 'Error',
        description: 'Stripe is not loaded yet. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast({
        title: 'Error',
        description: 'Card details are required.',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Call backend to initiate payment and get client_secret
      const response = await fetch(`/api/invoice/${invoiceId}/initiate-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initiate payment');
      }

      const { client_secret } = await response.json();

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        toast({
          title: 'Payment Successful',
          description: `Invoice #${invoiceNumber} has been paid.`,
        });
        onClose();
        if (onSuccess) {
          onSuccess(invoiceNumber, amount);
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'An error occurred during payment.',
        variant: 'destructive',
      });
      if (onFailure) {
        onFailure(invoiceNumber, error.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay Invoice #{invoiceNumber}</DialogTitle>
          <DialogDescription>
            Amount: ${(amount / 100).toFixed(2)} USD
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-4 border rounded-md bg-background">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: 'hsl(var(--foreground))',
                    '::placeholder': {
                      color: 'hsl(var(--muted-foreground))',
                    },
                  },
                  invalid: {
                    color: 'hsl(var(--destructive))',
                  },
                },
              }}
            />
          </div>

          <Button 
            onClick={handlePayment} 
            disabled={!stripe || processing}
            className="w-full"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Confirm Payment - $${(amount / 100).toFixed(2)}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
