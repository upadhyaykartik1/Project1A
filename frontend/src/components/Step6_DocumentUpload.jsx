import { useState } from 'react';
import { useForm } from '../context/FormContext';
import { uploadDocument } from '../services/api';
import { compressImage } from '../utils/compressImage';

export default function Step6_DocumentUpload({ onNext, onBack }) {
  const { formData, updateForm } = useForm();
  const documents = formData.documents || [];
  const hasExistingLoan = formData.loanSpecific?.hasExistingLoan === 'yes';

  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  const requiredDocs = [
    { key: 'panCard', label: 'PAN Card', mandatory: true },
    { key: 'aadhaarCard', label: 'Aadhaar Card', mandatory: true },
    { key: 'incomeCertificate', label: 'Income Certificate', mandatory: true },
  ];
  if (hasExistingLoan) {
    requiredDocs.push({ key: 'previousLoanSlip', label: 'Previous Loan Slip', mandatory: true });
  }

  const getDocByKey = (key) => documents.find(doc => doc.key === key);

  const handleFile = async (docKey, file) => {
    if (!file) return;
    // Validate file size (5 MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [docKey]: 'File size must be less than 5 MB' }));
      return;
    }
    setErrors(prev => ({ ...prev, [docKey]: null }));
    setUploading(prev => ({ ...prev, [docKey]: true }));
    try {
      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        fileToUpload = await compressImage(file, 0.5);
      }
      const res = await uploadDocument(fileToUpload);
      const newDoc = {
        key: docKey,
        name: file.name,
        url: res.filePath,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(fileToUpload) : null,
        size: fileToUpload.size,
      };
      // Remove old document with same key if exists
      const filtered = documents.filter(doc => doc.key !== docKey);
      updateForm('documents', [...filtered, newDoc]);
    } catch (err) {
      console.error(err);
      setErrors(prev => ({ ...prev, [docKey]: 'Upload failed. Please try again.' }));
    } finally {
      setUploading(prev => ({ ...prev, [docKey]: false }));
    }
  };

  const removeDocument = (docKey) => {
    const filtered = documents.filter(doc => doc.key !== docKey);
    updateForm('documents', filtered);
  };

  const allMandatoryUploaded = requiredDocs.every(doc =>
    documents.some(d => d.key === doc.key)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upload Required Documents</h2>
      <p className="text-sm text-gray-600">Please upload clear, readable copies. Max file size: 5 MB per file.</p>

      <div className="space-y-5">
        {requiredDocs.map((doc) => {
          const existing = getDocByKey(doc.key);
          const isUploading = uploading[doc.key];
          const error = errors[doc.key];
          return (
            <div key={doc.key} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <label className="font-medium text-gray-800">
                  {doc.label} {doc.mandatory && <span className="text-red-500">*</span>}
                </label>
                {existing && (
                  <button
                    onClick={() => removeDocument(doc.key)}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
              {!existing ? (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFile(doc.key, e.target.files[0])}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {isUploading && <p className="text-sm text-gray-500 mt-1">Compressing & uploading...</p>}
                  {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-3">
                  {existing.preview ? (
                    <img src={existing.preview} alt="preview" className="h-16 w-16 object-cover rounded border" />
                  ) : (
                    <span className="text-sm text-gray-600">📄 {existing.name}</span>
                  )}
                  <span className="text-xs text-gray-500">{(existing.size / 1024).toFixed(0)} KB</span>
                  <a href={existing.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm">View</a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn-outline">Back</button>
        <button
          onClick={onNext}
          disabled={!allMandatoryUploaded}
          className="btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}