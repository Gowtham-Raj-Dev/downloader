'use client';

import { useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

interface RazorpayCheckoutProps {
  userEmail: string;
  onSuccess: () => void;
}

export default function RazorpayCheckout({ userEmail, onSuccess }: RazorpayCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!userEmail) {
      alert('Please enter your email first to purchase.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Load the script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      // 2. Create the order on the backend
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 10, currency: 'INR' }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      const order = data.order;

      // 3. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'CodeLove Downloader',
        description: '3-Hour Premium Pass',
        order_id: order.id,
        handler: async function (response: unknown) {
          const res = response as { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
          // 4. Verify payment on the backend
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              onSuccess(); // Payment verified, unlock premium features!
            } else {
              alert('Payment verification failed!');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Something went wrong while verifying the payment.');
          }
        },
        prefill: {
          email: userEmail,
        },
        theme: {
          color: '#3B82F6', // Blue color to match premium UI
        },
      };

      // @ts-expect-error - Razorpay injected onto window
      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: unknown) {
        const res = response as { error: { description: string } };
        console.error('Payment failed:', res.error);
        alert(`Payment failed: ${res.error.description}`);
      });

      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-xl shadow-sm text-center">
      <div className="w-12 h-12 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
        <ShieldCheck className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">VIP Pass</h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-5">
        Unlock unrestricted Batch downloads & VIP features for 3 full hours.
      </p>

      <button
        onClick={handlePayment}
        disabled={isProcessing || !userEmail}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connecting Securely...</span>
          </>
        ) : (
          <span>Pay ₹10 Securely</span>
        )}
      </button>

      <p className="text-[9px] text-neutral-400 mt-3 font-medium uppercase tracking-wider">
        Secured by Razorpay
      </p>
    </div>
  );
}
