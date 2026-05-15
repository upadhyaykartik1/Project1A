import { useState, useEffect } from 'react';
import { useForm } from '../context/FormContext';
import { getPreApproval } from '../services/api';

export default function Step5_LoanSpecific({ onNext, onBack }) {
  const { formData, updateForm } = useForm();
  const loanSpecific = formData.loanSpecific || {};
  const loanType = formData.loanType;
  const annualIncome = formData.employment?.annualIncome || 0;

  const [eligibility, setEligibility] = useState(null);
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const [eligibilityError, setEligibilityError] = useState('');
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Existing loan details from form
  const hasExistingLoan = loanSpecific.hasExistingLoan || 'no';
  const existingLoanDetails = loanSpecific.existingLoanDetails || {
    amount: '',
    bank: '',
    reason: '',
    remainingTenure: '',
  };

  const loanAmount = loanSpecific.loanAmount || 0;
  const tenureMonths = loanSpecific.tenureMonths || 6;

  // Fetch eligibility
  useEffect(() => {
    const fetchEligibility = async () => {
      if (!loanAmount || loanAmount <= 0 || !annualIncome) {
        setEligibility(null);
        return;
      }
      setLoadingEligibility(true);
      setEligibilityError('');
      try {
        const result = await getPreApproval({
          loanType,
          annualIncome,
          loanAmount: loanAmount,
          employmentType: formData.employment?.type,
        });
        setEligibility(result);
      } catch (err) {
        console.error(err);
        setEligibilityError('Could not check eligibility. Please try again.');
      } finally {
        setLoadingEligibility(false);
      }
    };
    fetchEligibility();
  }, [loanAmount, loanType, annualIncome, formData.employment?.type]);

  // Calculate EMI and total interest
  useEffect(() => {
    if (loanAmount > 0 && tenureMonths >= 6 && eligibility?.interestRate) {
      const monthlyRate = eligibility.interestRate / 100 / 12;
      const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      if (isFinite(emi)) {
        setMonthlyEMI(Math.round(emi));
        setTotalInterest(Math.round(emi * tenureMonths - loanAmount));
      } else {
        setMonthlyEMI(0);
        setTotalInterest(0);
      }
    } else {
      setMonthlyEMI(0);
      setTotalInterest(0);
    }
  }, [loanAmount, tenureMonths, eligibility?.interestRate]);

  const updateLoanSpecific = (field, value) => {
    updateForm('loanSpecific', { ...loanSpecific, [field]: value });
  };

  const updateExistingLoanDetails = (field, value) => {
    updateForm('loanSpecific', {
      ...loanSpecific,
      existingLoanDetails: { ...existingLoanDetails, [field]: value },
    });
  };

  const isAmountValid = eligibility && eligibility.maxLoanAmount
    ? loanAmount <= eligibility.maxLoanAmount
    : true;
  const isTenureValid = tenureMonths >= 6;
  const displayWarning = eligibility && loanAmount > eligibility.maxLoanAmount;

  // Validate existing loan section if "yes"
  const isExistingLoanValid = hasExistingLoan === 'no' || (
    hasExistingLoan === 'yes' &&
    existingLoanDetails.amount > 0 &&
    existingLoanDetails.bank.trim() !== '' &&
    existingLoanDetails.reason.trim() !== '' &&
    existingLoanDetails.remainingTenure >= 1
  );

  // Conditional fields based on loan type (keep existing)
  let conditionalFields = null;
  let isComplete = false;

  if (loanType === 'Personal') {
  const purpose = loanSpecific.purpose || '';
  isComplete = purpose.trim().length > 0 && loanAmount > 0 && isAmountValid && isTenureValid && isExistingLoanValid;
  conditionalFields = (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Loan Purpose</label>
      <select
        className="input"
        value={loanSpecific.purpose || ''}
        onChange={(e) => updateLoanSpecific('purpose', e.target.value)}
      >
        <option value="">Select purpose</option>
        <option value="Debt Consolidation">Debt Consolidation</option>
        <option value="Wedding">Wedding</option>
        <option value="Medical Emergency">Medical Emergency</option>
        <option value="Travel">Travel</option>
        <option value="Home Renovation">Home Renovation</option>
      </select>
    </div>
  );
}
  else if (loanType === 'Home') {
    const propertyValue = loanSpecific.propertyValue || 0;
    const downPayment = loanSpecific.downPayment || 0;
    isComplete = propertyValue > 0 && downPayment >= 0 && loanAmount > 0 && isAmountValid && isTenureValid && isExistingLoanValid;
    conditionalFields = (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Value (₹)</label>
          <input
            type="number"
            className="input"
            value={loanSpecific.propertyValue || ''}
            onChange={(e) => updateLoanSpecific('propertyValue', Number(e.target.value))}
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment (₹)</label>
          <input
            type="number"
            className="input"
            value={loanSpecific.downPayment || ''}
            onChange={(e) => updateLoanSpecific('downPayment', Number(e.target.value))}
            min="0"
          />
        </div>
      </>
    );
  } 
  else if (loanType === 'Business') {
    const annualTurnover = loanSpecific.annualTurnover || 0;
    const businessVintage = loanSpecific.businessVintage || 0;
    isComplete = annualTurnover > 0 && businessVintage >= 1 && loanAmount > 0 && isAmountValid && isTenureValid && isExistingLoanValid;
    conditionalFields = (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Annual Turnover (₹)</label>
          <input
            type="number"
            className="input"
            value={loanSpecific.annualTurnover || ''}
            onChange={(e) => updateLoanSpecific('annualTurnover', Number(e.target.value))}
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Vintage (years)</label>
          <input
            type="number"
            className="input"
            value={loanSpecific.businessVintage || ''}
            onChange={(e) => updateLoanSpecific('businessVintage', Number(e.target.value))}
            min="0"
            step="0.5"
          />
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Loan Details – {loanType} Loan</h2>

      {/* Loan Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount Required (₹)</label>
        <input
          type="number"
          className="input"
          value={loanAmount || ''}
          onChange={(e) => updateLoanSpecific('loanAmount', Number(e.target.value))}
          min="10000"
          step="10000"
        />
      </div>

      {/* Tenure */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Tenure (months)</label>
        <input
          type="number"
          className="input"
          value={tenureMonths}
          onChange={(e) => updateLoanSpecific('tenureMonths', Math.max(6, Number(e.target.value)))}
          min="6"
          step="1"
        />
        {!isTenureValid && <p className="text-red-600 text-sm mt-1">Minimum tenure is 6 months</p>}
      </div>

      {/* Eligibility & EMI Section */}
      {loadingEligibility && <div className="text-gray-500 text-sm">Checking eligibility...</div>}
      {eligibilityError && <div className="text-red-600 text-sm">{eligibilityError}</div>}
      {eligibility && (
        <div className={`p-3 rounded-lg text-sm space-y-2 ${displayWarning ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <p><strong>Your maximum eligible loan amount:</strong> ₹{eligibility.maxLoanAmount.toLocaleString()}</p>
          <p><strong>Interest rate (per annum):</strong> {eligibility.interestRate}%</p>
          {displayWarning && (
            <p className="text-red-600 font-semibold">
              ⚠️ Requested amount exceeds your eligibility. Maximum allowed: ₹{eligibility.maxLoanAmount.toLocaleString()}
            </p>
          )}
          {!displayWarning && loanAmount > 0 && loanAmount <= eligibility.maxLoanAmount && isTenureValid && (
            <>
              <p className="text-green-600 font-semibold">✓ You are eligible for this amount.</p>
              <div className="border-t pt-2 mt-2">
                <p><strong>Monthly EMI (approx):</strong> ₹{monthlyEMI.toLocaleString()}</p>
                <p><strong>Total Interest Payable:</strong> ₹{totalInterest.toLocaleString()}</p>
                <p><strong>Total Repayment Amount:</strong> ₹{(loanAmount + totalInterest).toLocaleString()}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Existing Loan Section */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Do you currently have any existing loan?</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="hasExistingLoan"
              value="no"
              checked={hasExistingLoan === 'no'}
              onChange={() => updateLoanSpecific('hasExistingLoan', 'no')}
            />
            No
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="hasExistingLoan"
              value="yes"
              checked={hasExistingLoan === 'yes'}
              onChange={() => updateLoanSpecific('hasExistingLoan', 'yes')}
            />
            Yes
          </label>
        </div>
      </div>

      {hasExistingLoan === 'yes' && (
        <div className="space-y-4 pl-4 border-l-2 border-blue-200">
          <h3 className="font-medium text-gray-800">Existing Loan Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹)</label>
            <input
              type="number"
              className="input"
              value={existingLoanDetails.amount}
              onChange={(e) => updateExistingLoanDetails('amount', Number(e.target.value))}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank / Lender Name</label>
            <input
              type="text"
              className="input"
              value={existingLoanDetails.bank}
              onChange={(e) => updateExistingLoanDetails('bank', e.target.value)}
              placeholder="e.g., SBI, HDFC, ICICI"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason of loan</label>
            <input
              type="text"
              className="input"
              value={existingLoanDetails.reason}
              onChange={(e) => updateExistingLoanDetails('reason', e.target.value)}
              placeholder="e.g., Home, Car, Education"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Tenure (months)</label>
            <input
              type="number"
              className="input"
              value={existingLoanDetails.remainingTenure}
              onChange={(e) => updateExistingLoanDetails('remainingTenure', Number(e.target.value))}
              min="1"
            />
          </div>
        </div>
      )}

      {conditionalFields}

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn-outline">Back</button>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}