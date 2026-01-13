'use client';

interface CheckoutStepsProps {
  currentStep: number;
}

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { number: 1, label: 'Details' },
    { number: 2, label: 'Order Type' },
    { number: 3, label: 'Payment' },
    { number: 4, label: 'Review' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep >= step.number
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <div
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 ${
                  currentStep > step.number ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



