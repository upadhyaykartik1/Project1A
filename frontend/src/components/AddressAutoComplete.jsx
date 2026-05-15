import { useState, useEffect, useRef } from 'react';

export default function AddressAutocomplete({ onPlaceSelected }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&addressdetails=1&limit=5&countrycodes=in`
        );
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setSuggestions(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load address suggestions');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [input]);

  const handleSelect = (suggestion) => {
    const address = suggestion.address || {};
    const displayName = suggestion.display_name || '';

    const street = [
      address.road,
      address.house_number,
      address.suburb,
      address.neighbourhood,
      address.village,
      address.town,
      address.city,
    ].filter(Boolean).join(', ') || displayName.split(',')[0];

    const city = address.city || address.town || address.village || address.municipality || '';

    let state = address.state || address.region || address.province || '';
    if (!state && displayName) {
      const parts = displayName.split(',');
      if (parts.length >= 3) state = parts[parts.length - 3]?.trim() || '';
    }

    let pincode = address.postcode || address.postal_code || '';
    if (!pincode && displayName) {
      const match = displayName.match(/\b\d{6}\b/);
      if (match) pincode = match[0];
    }
    if (!pincode) {
      for (const key in address) {
        if (address[key] && typeof address[key] === 'string') {
          const match = address[key].match(/\b\d{6}\b/);
          if (match) {
            pincode = match[0];
            break;
          }
        }
      }
    }

    const country = address.country || 'India';

    onPlaceSelected({ street, city, state, pincode, country });
    setInput(displayName);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="input w-full"
        placeholder="Start typing your address (min 3 characters)..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {loading && <div className="text-sm text-gray-500 mt-1">Searching...</div>}
      {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
      {suggestions.length > 0 && (
        <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-0"
              onClick={() => handleSelect(s)}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}