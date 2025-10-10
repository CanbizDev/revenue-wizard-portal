import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe, StripeCardElementOptions } from '@stripe/stripe-js'; // Import StripeCardElementOptions
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51Rl2934FdWlWkF1474kMwJpmbKHMcSo0ongk4FFdYXbXcZwiAEewxOfVbNsrcRfQNtlgob6XtvQ2AVdkbavzsWMd004meMyXSQ');

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    invoiceId: string;
    totalBilling: number;
  } | null;
  onPaymentSuccess: () => void;
}

// --- Style object for the Stripe Card Element ---
const cardStyle: StripeCardElementOptions['style'] = {
  base: {
    color: '#32325d',
    fontFamily: 'Arial, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
};


const CheckoutForm: React.FC<Omit<PaymentModalProps, 'isOpen'>> = ({
  invoice,
  onClose,
  onPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !invoice) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Fetch client_secret from your backend
      const { client_secret } = await apiService.initiatePayment(invoice.id);

      // 2. Confirm the card payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              // You can add more billing details here if needed
              name: 'Customer Name', 
            },
          },
        }
      );

      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred.');
        setIsLoading(false);
        navigate('/payment-failed'); // Redirect on failure
        return;
      }

      // 3. Handle successful payment
      if (paymentIntent?.status === 'succeeded') {
        toast({
          title: 'Payment Successful!',
          description: `Invoice #${invoice.invoiceId} has been paid.`,
        });
        onPaymentSuccess();
        onClose();
      }
    } catch (err) {
      setErrorMessage('Failed to process payment. Please try again.');
      navigate('/payment-failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>Pay Invoice #{invoice?.invoiceId}</DialogTitle>
        <DialogDescription>
          Amount:
          <span className="font-bold text-lg text-foreground ml-2">
            ${/* Apply better currency formatting */}
            {(invoice?.totalBilling ?? 0).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </DialogDescription>
      </DialogHeader>

      <div>
        <label
          htmlFor="card-element"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Card Details
        </label>
        <div className="p-3 border rounded-md bg-white"> {/* Changed background to white for better contrast */}
          <CardElement
            id="card-element"
            options={{
              style: cardStyle, // --- Apply the style here ---
              hidePostalCode: true, // Optional: simplifies the form
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="text-red-600 text-sm text-center">{errorMessage}</div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Confirm Payment'
          )}
        </Button>
      </div>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onPaymentSuccess,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <Elements stripe={stripePromise}>
        <CheckoutForm
          invoice={invoice}
          onClose={onClose}
          onPaymentSuccess={onPaymentSuccess}
        />
      </Elements>
    </DialogContent>
  </Dialog>
);

export default PaymentModal;