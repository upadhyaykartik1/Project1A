import { useForm } from '../context/FormContext';

export default function Step4_Employment({ onNext, onBack }) {
  const { formData, updateForm } = useForm();
  const employment = formData.employment || { type: 'Salaried', annualIncome: '', employer: '' };

  const updateEmployment = (field, value) => {
    updateForm('employment', { ...employment, [field]: value });
  };

  const isComplete = employment.annualIncome && employment.annualIncome > 0 &&
    (employment.type !== 'Salaried' || employment.employer);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Employment & Income</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
        <div className="flex gap-4 flex-wrap">
          {['Salaried', 'Self-employed', 'Business Owner', 'Unemployed'].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                name="empType"
                value={type}
                checked={employment.type === type}
                onChange={() => updateEmployment('type', type)}
                className="w-4 h-4 text-blue-600"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {employment.type === 'Salaried' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employer Name</label>
          <input
            type="text"
            className="input"
            value={employment.employer || ''}
            onChange={(e) => updateEmployment('employer', e.target.value)}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income (₹)</label>
        <input
          type="number"
          className="input"
          value={employment.annualIncome || ''}
          onChange={(e) => updateEmployment('annualIncome', Number(e.target.value))}
          min="0"
          step="10000"
          placeholder="e.g., 850000"
        />
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn-outline">Back</button>
        <button onClick={onNext} disabled={!isComplete} className="btn-primary">Next</button>
      </div>
    </div>
  );
}