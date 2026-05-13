import { useForm } from '../context/FormContext';

export default function Step5_LoanSpecific({ onNext, onBack }) {
  const { formData, updateForm } = useForm();
  const loanSpecific = formData.loanSpecific || {};
  const loanType = formData.loanType;

  const updateField = (field, value) => {
    updateForm('loanSpecific', { ...loanSpecific, [field]: value });
  };

  let isComplete = false;
  let conditionalFields = null;

  if (loanType === 'Personal') {
    const purpose = loanSpecific.purpose || '';
    const existingEmi = loanSpecific.existingEmi || 0;
    isComplete = purpose.trim().length > 0 && existingEmi >= 0;
    conditionalFields = (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loan Purpose</label>
          <select
            className="input"
            value={loanSpecific.purpose || ''}
            onChange={(e) => updateField('purpose', e.target.value)}
          >
            <option value="">Select purpose</option>
            <option value="Debt Consolidation">Debt Consolidation</option>
            <option value="Wedding">Wedding</option>
            <option value="Medical Emergency">Medical Emergency</option>
            <option value="Travel">Travel</option>
            <option value="Home Renovation">Home Renovation</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Existing EMI per month (₹)</label>
          <input
            type="number"
            className="input"
            value={loanSpecific.existingEmi || 0}
            onChange={(e) => updateField('existingEmi', Number(e.target.value))}
            min="0"
          />
        </div>
      </>
    );
  } 
  else if (loanType === 'Home') {
    const propertyValue = loanSpecific.propertyValue || 0;
    const downPayment = loanSpecific.downPayment || 0;
    isComplete = propertyValue > 0 && downPayment >= 0;
    conditionalFields = (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Value (₹)</label>
          <input
            type="number"
            className="input"
            value={loanSpecific.propertyValue || ''}
            onChange={(e) => updateField('propertyValue', Number(e.target.value))}
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment (₹)</label>
          <input
            type="number"
            className="input"
            value={loanSpecific.downPayment || ''}
            onChange={(e) => updateField('downPayment', Number(e.target.value))}
            min="0"
          />
        </div>
      </>
    );
  } 
  else if (loanType === 'Business') {
    const annualTurnover = loanSpecific.annualTurnover || 0;
    const businessVintage = loanSpecific.businessVintage || 0;
    isComplete = annualTurnover > 0 && businessVintage >= 1;
    conditionalFields = (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Annual Turnover (₹)</label>
          <input
            type="number"
            className="input"
            value={loanSpecific.annualTurnover || ''}
            onChange={(e) => updateField('annualTurnover', Number(e.target.value))}
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Vintage (years)</label>
          <input
            type="number"
            className="input"
            value={loanSpecific.businessVintage || ''}
            onChange={(e) => updateField('businessVintage', Number(e.target.value))}
            min="0"
            step="0.5"
          />
        </div>
      </>
    );
  }

  // Common loan amount field (for all types)
  const commonFields = (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount Required (₹)</label>
      <input
        type="number"
        className="input"
        value={loanSpecific.loanAmount || ''}
        onChange={(e) => updateField('loanAmount', Number(e.target.value))}
        min="10000"
        step="10000"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Loan Details – {loanType} Loan</h2>
      {commonFields}
      {conditionalFields}
      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn-outline">Back</button>
        <button onClick={onNext} disabled={!isComplete || !loanSpecific.loanAmount} className="btn-primary">
          Next
        </button>
      </div>
    </div>
  );
}