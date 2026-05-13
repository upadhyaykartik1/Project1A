import { useState } from 'react';
import { useForm } from '../context/FormContext';
import { verifyPAN, verifyAadhaar } from '../services/api';
import { validatePAN, validateAadhaar } from '../utils/validation';
import Toast from './Toast';

export default function Step2_PersonalInfo({ onNext, onBack }) {
  const { formData, updateForm } = useForm();
  const [toast, setToast] = useState(null);
  const [verifying, setVerifying] = useState({ pan: false, aadhaar: false });

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePanChange = (value) => {
    const pan = value.toUpperCase();
    updateForm('personal', { pan, panVerified: false });
    // clear any existing error (will be removed from UI)
  };

  const handleAadhaarChange = (value) => {
    updateForm('personal', { aadhaar: value, aadhaarVerified: false });
  };

  const handleVerifyPAN = async () => {
    const pan = formData.personal?.pan || '';
    if (!validatePAN(pan)) {
      showToast('Invalid PAN format (e.g., ABCDE1234F)', 'error');
      return;
    }
    setVerifying(prev => ({ ...prev, pan: true }));
    try {
      const res = await verifyPAN(pan);
      if (res.valid) {
        updateForm('personal', { panVerified: true });
        showToast('PAN verified successfully!', 'success');
      } else {
        updateForm('personal', { panVerified: false });
        showToast(res.message || 'PAN verification failed', 'error');
      }
    } catch (err) {
      showToast('Server error. Please try again.', 'error');
    } finally {
      setVerifying(prev => ({ ...prev, pan: false }));
    }
  };

  const handleVerifyAadhaar = async () => {
    const aadhaar = formData.personal?.aadhaar || '';
    if (!validateAadhaar(aadhaar)) {
      showToast('Aadhaar must be 12 digits starting with 2-9', 'error');
      return;
    }
    setVerifying(prev => ({ ...prev, aadhaar: true }));
    try {
      const res = await verifyAadhaar(aadhaar);
      if (res.valid) {
        updateForm('personal', { aadhaarVerified: true });
        showToast('Aadhaar verified successfully!', 'success');
      } else {
        updateForm('personal', { aadhaarVerified: false });
        showToast(res.message || 'Aadhaar verification failed', 'error');
      }
    } catch (err) {
      showToast('Server error. Please try again.', 'error');
    } finally {
      setVerifying(prev => ({ ...prev, aadhaar: false }));
    }
  };

  const canProceed = formData.personal?.panVerified && formData.personal?.aadhaarVerified;

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <h2 className="text-2xl font-bold">Personal Information</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          className="input"
          value={formData.personal?.fullName || ''}
          onChange={e => updateForm('personal', { fullName: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
        <input
          type="date"
          className="input"
          value={formData.personal?.dob || ''}
          onChange={e => updateForm('personal', { dob: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="ABCDE1234F"
            value={formData.personal?.pan || ''}
            onChange={e => handlePanChange(e.target.value)}
          />
          <button
            onClick={handleVerifyPAN}
            disabled={verifying.pan}
            className="btn-secondary whitespace-nowrap"
          >
            {verifying.pan ? 'Verifying...' : 'Verify PAN'}
          </button>
        </div>
        {formData.personal?.panVerified && <p className="text-green-600 text-sm mt-1">✓ Verified</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="123456789012"
            value={formData.personal?.aadhaar || ''}
            onChange={e => handleAadhaarChange(e.target.value)}
            maxLength={12}
          />
          <button
            onClick={handleVerifyAadhaar}
            disabled={verifying.aadhaar}
            className="btn-secondary whitespace-nowrap"
          >
            {verifying.aadhaar ? 'Verifying...' : 'Verify Aadhaar'}
          </button>
        </div>
        {formData.personal?.aadhaarVerified && <p className="text-green-600 text-sm mt-1">✓ Verified</p>}
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn-outline">Back</button>
        <button onClick={onNext} disabled={!canProceed} className="btn-primary">Next</button>
      </div>
    </div>
  );
}