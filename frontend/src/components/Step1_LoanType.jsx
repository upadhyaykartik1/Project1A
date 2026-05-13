import { useForm } from '../context/FormContext';

export default function Step1_LoanType({ onNext }) {
  const { formData, updateForm } = useForm();
  const types = ['Personal', 'Home', 'Business'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Select Loan Type</h2>
      <div className="flex gap-4 flex-wrap">
        {types.map(type => (
          <button
            key={type}
            onClick={() => updateForm('loanType', type)}
            className={`px-6 py-3 rounded-xl border-2 transition ${
              formData.loanType === type
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700'
            }`}
          >
            {type} Loan
          </button>
        ))}
      </div>
      <button onClick={onNext} className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg">Next</button>
    </div>
  );
}