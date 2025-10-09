import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51QsnVBP3BiShTWjZ7Y3kcqU4hBjjzQbVXvqhgSHWIGk7s5q8WxJaTnvLqE7iEON4Ol1XL6jlC6cHpf0HOSg8L48Q00UWIO6vWc';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
