import { useRef, useState } from 'react';
import { useForm } from '../context/FormContext';
import SignatureCanvas from 'react-signature-canvas';

export default function Step7_ESignature({ onNext, onBack }) {
  const { formData, updateForm } = useForm();
  const sigPad = useRef();
  const [isEmpty, setIsEmpty] = useState(true);

  const saveSignature = () => {
    if (sigPad.current.isEmpty()) return setIsEmpty(true);
    const dataURL = sigPad.current.toDataURL();
    updateForm('signature', dataURL);
    setIsEmpty(false);
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">E‑Signature</h2>
      <div className="border rounded mt-4">
        <SignatureCanvas ref={sigPad} canvasProps={{ width: 500, height: 200, className: 'w-full border' }} />
      </div>
      <div className="flex gap-4 mt-4">
        <button onClick={() => sigPad.current.clear()} className="btn-outline">Clear</button>
        <button onClick={saveSignature} className="btn-primary">Save & Continue</button>
      </div>
      <button onClick={onBack} className="btn-outline mt-4">Back</button>
    </div>
  );
}