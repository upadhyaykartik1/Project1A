import { useForm } from '../context/FormContext';
import AddressAutocomplete from './AddressAutocomplete';

export default function Step3_Address({ onNext, onBack }) {
  const { formData, updateForm } = useForm();
  const address = formData.address || { street: '', city: '', state: '', pincode: '', country: 'India' };

  const updateAddress = (field, value) => {
    updateForm('address', { ...address, [field]: value });
  };

  const handlePlaceSelected = (selected) => {
    updateForm('address', {
      street: selected.street,
      city: selected.city,
      state: selected.state,
      pincode: selected.pincode,
      country: selected.country || 'India',
    });
  };

  const isComplete = address.street && address.city && address.state && address.pincode && address.country;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Residential Address</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search address </label>
        <AddressAutocomplete onPlaceSelected={handlePlaceSelected} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street / Full address</label>
          <input
            type="text"
            className="input"
            value={address.street}
            onChange={(e) => updateAddress('street', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            className="input"
            value={address.city}
            onChange={(e) => updateAddress('city', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input
            type="text"
            className="input"
            value={address.state}
            onChange={(e) => updateAddress('state', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
          <input
            type="text"
            className="input"
            value={address.pincode}
            onChange={(e) => updateAddress('pincode', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
        <input
          type="text"
          className="input"
          value={address.country}
          onChange={(e) => updateAddress('country', e.target.value)}
        />
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn-outline">Back</button>
        <button onClick={onNext} disabled={!isComplete} className="btn-primary">Next</button>
      </div>
    </div>
  );
}