import { useState } from 'react';
import { useForm } from '../context/FormContext';
import { uploadDocument } from '../services/api';
import { compressImage } from "../utils/compressImage";

export default function Step6_DocumentUpload({ onNext, onBack }) {
  const { formData, updateForm } = useForm();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const compressed = await compressImage(file);
    const formDataObj = new FormData();
    formDataObj.append('document', compressed);
    const res = await uploadDocument(compressed);
    const newDoc = { name: file.name, url: res.filePath, preview: URL.createObjectURL(compressed) };
    updateForm('documents', [...(formData.documents || []), newDoc]);
    setUploading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Upload Documents (PAN, Income proof, etc.)</h2>
      <input type="file" accept="image/*,application/pdf" onChange={handleFile} disabled={uploading} />
      {uploading && <p>Compressing & uploading...</p>}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {formData.documents?.map((doc, idx) => (
          <div key={idx} className="border p-2 rounded">
            {doc.url?.match(/\.(jpeg|jpg|png|gif)$/i) ? <img src={doc.preview} alt="preview" className="h-24 object-cover" /> : <span>{doc.name}</span>}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="btn-outline">Back</button>
        <button onClick={onNext} className="btn-primary">Next</button>
      </div>
    </div>
  );
}