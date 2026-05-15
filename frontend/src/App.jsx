import React, { useState, useEffect, useCallback } from 'react';
import { FormProvider } from './context/FormContext';
import StepIndicator from './components/StepIndicator';
import Step1_LoanType from './components/Step1_LoanType';
import Step2_PersonalInfo from './components/Step2_PersonalInfo';
import Step3_Address from './components/Step3_Address';
import Step4_Employment from './components/Step4_Employment';
import Step5_LoanSpecific from './components/Step5_LoanSpecific';
import Step6_DocumentUpload from './components/Step6_DocumentUpload';
import Step7_ESignature from './components/Step7_ESignature';
import Step8_ReviewSummary from './components/Step8_ReviewSummary';
import { getResumedData } from './services/api';
import useAutoSave from './hooks/useAutoSave';

const steps = [
  { id: 1, name: 'Loan Type', component: Step1_LoanType },
  { id: 2, name: 'Personal Info', component: Step2_PersonalInfo },
  { id: 3, name: 'Address', component: Step3_Address },
  { id: 4, name: 'Employment', component: Step4_Employment },
  { id: 5, name: 'Loan Specifics', component: Step5_LoanSpecific },
  { id: 6, name: 'Documents', component: Step6_DocumentUpload },
  { id: 7, name: 'E‑Signature', component: Step7_ESignature },
  { id: 8, name: 'Review & Pre‑approval', component: Step8_ReviewSummary },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    loanType: 'Personal',
    personal: { fullName: '', dob: '', pan: '', aadhaar: '', panVerified: false, aadhaarVerified: false },
    address: { street: '', city: '', state: '', pincode: '', country: 'India' },
    employment: { type: 'Salaried', annualIncome: '', employer: '' },
    loanSpecific: {},
    documents: [],
    signature: null,
    sessionId: `session_${Date.now()}`,
  });

  // Resume saved progress
  useEffect(() => {
    const saved = localStorage.getItem('loanSessionId');
    const session = saved || formData.sessionId;
    if (!localStorage.getItem('loanSessionId')) localStorage.setItem('loanSessionId', session);
    getResumedData(session).then(data => {
      if (data && Object.keys(data).length) {
        setFormData(prev => ({ ...prev, ...data, sessionId: session }));
      }
    });
  }, []);

  useAutoSave(formData, 2000);

  const updateForm = useCallback((section, value) => {
    setFormData(prev => {
      const topLevelFields = ['loanType', 'signature', 'documents', 'sessionId'];
      if (topLevelFields.includes(section)) {
        return { ...prev, [section]: value };
      }
      return { ...prev, [section]: { ...prev[section], ...value } };
    });
  }, []);

  // Reset everything and go to step 0 (home page)
  const resetForm = useCallback(() => {
    setFormData({
      loanType: 'Personal',
      personal: { fullName: '', dob: '', pan: '', aadhaar: '', panVerified: false, aadhaarVerified: false },
      address: { street: '', city: '', state: '', pincode: '', country: 'India' },
      employment: { type: 'Salaried', annualIncome: '', employer: '' },
      loanSpecific: {},
      documents: [],
      signature: null,
      sessionId: `session_${Date.now()}`,
    });
    setCurrentStep(0);
    localStorage.removeItem('loanSessionId');
  }, []);

  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
  };
  const goBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const CurrentStepComponent = steps[currentStep].component;

  const contextValue = {
    formData,
    updateForm,
    currentStep,
    stepsLength: steps.length,
    resetForm,
  };

  return (
    <FormProvider value={contextValue}>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <StepIndicator steps={steps} currentStep={currentStep} />
          <div className="p-6 md:p-8">
            <CurrentStepComponent onNext={goNext} onBack={goBack} />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

export default App;