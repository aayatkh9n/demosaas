import { Suspense } from "react";
import PaymentContent from "./payment-content";

function PaymentLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-lg p-8 text-center space-y-6">
        
        {/* Spinner */}
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-primary animate-spin" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900">
            Preparing secure payment
          </p>
          <p className="text-sm text-gray-600">
            Please wait a moment…
          </p>
        </div>

        {/* Trust */}
        <div className="flex justify-center gap-4 text-sm text-gray-500 pt-2">
          <span className="flex items-center gap-1">🔒 Secure</span>
          <span className="flex items-center gap-1">💳 UPI / COD</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentContent />
    </Suspense>
  );
}
