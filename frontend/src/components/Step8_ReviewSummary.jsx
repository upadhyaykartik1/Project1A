import { useState, useEffect } from 'react';
import { useForm } from '../context/FormContext';
import { getPreApproval } from '../services/api';

export default function Step8_ReviewSummary({ onBack }) {
  const { formData } = useForm();
  const [preApproval, setPreApproval] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const payload = {
      loanType: formData.loanType,
      annualIncome: formData.employment?.annualIncome || 0,
      loanAmount: formData.loanSpecific?.loanAmount || 0,
      employmentType: formData.employment?.type || 'Salaried',
      cibilScore: 750, // Mock – can be made dynamic
    };
    getPreApproval(payload)
      .then(setPreApproval)
      .finally(() => setLoading(false));
  }, [formData]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review & Pre‑approval Summary</h2>

      <div className="bg-gray-50 p-5 rounded-xl space-y-3">
        <h3 className="font-semibold text-lg border-b pb-2">Applicant Details</h3>
        <p><span className="font-medium">Name:</span> {formData.personal?.fullName || '—'}</p>
        <p><span className="font-medium">PAN:</span> {formData.personal?.pan || '—'} {formData.personal?.panVerified && '✅'}</p>
        <p><span className="font-medium">Aadhaar:</span> {formData.personal?.aadhaar || '—'} {formData.personal?.aadhaarVerified && '✅'}</p>
        <p><span className="font-medium">Address:</span> {formData.address?.street}, {formData.address?.city} - {formData.address?.pincode}</p>
        <p><span className="font-medium">Employment:</span> {formData.employment?.type} | Income: ₹{formData.employment?.annualIncome?.toLocaleString()}</p>
        <p><span className="font-medium">Loan Type:</span> {formData.loanType}</p>
        <p><span className="font-medium">Requested Amount:</span> ₹{formData.loanSpecific?.loanAmount?.toLocaleString()}</p>
        {formData.loanType === 'Personal' && <p><span className="font-medium">Purpose:</span> {formData.loanSpecific?.purpose}</p>}
        {formData.loanType === 'Home' && <p><span className="font-medium">Property Value:</span> ₹{formData.loanSpecific?.propertyValue?.toLocaleString()}</p>}
        {formData.loanType === 'Business' && <p><span className="font-medium">Turnover:</span> ₹{formData.loanSpecific?.annualTurnover?.toLocaleString()}</p>}
        <p><span className="font-medium">Documents uploaded:</span> {formData.documents?.length || 0}</p>
        {formData.signature && <p className="text-green-700">✓ E‑signature captured</p>}
      </div>

      {loading && <p className="text-center text-gray-500">Calculating pre‑approval...</p>}
      {preApproval && (
        <div className={`p-5 rounded-xl ${preApproval.eligibility === 'High' ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300'}`}>
          <h3 className="font-bold text-lg">Pre‑approval Result</h3>
          <p>✅ Eligibility: <span className="font-semibold">{preApproval.eligibility}</span></p>
          <p>💰 Max Loan Amount: ₹{preApproval.maxLoanAmount.toLocaleString()}</p>
          <p>📉 Interest Rate (offered): {preApproval.interestRate}% p.a.</p>
          <p className="mt-2 text-sm">{preApproval.message}</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn-outline">Back</button>
        <button className="btn-primary" onClick={() => alert('Application submitted (demo)')}>
          Submit Application
        </button>
      </div>
    </div>
  );
}