export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
      <div className="flex flex-wrap gap-2 justify-between">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`text-xs md:text-sm font-medium px-3 py-1 rounded-full ${
              idx <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step.name}
          </div>
        ))}
      </div>
    </div>
  );
}