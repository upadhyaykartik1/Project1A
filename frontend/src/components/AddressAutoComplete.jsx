import { useState, useEffect } from 'react';
import { addressSuggest } from '../services/api';

export default function AddressAutocomplete({ value, onChange, onSelect }) {
  const [input, setInput] = useState(value?.street || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input.length >= 3) {
        setLoading(true);
        setError('');
        try {
          const results = await addressSuggest(input);
          console.log('Suggestions received:', results); // debug
          setSuggestions(results);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch suggestions');
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setError('');
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [input]);

  const handleSelect = (suggestion) => {
    setInput(suggestion.street);
    onChange(suggestion);
    setSuggestions([]);
    if (onSelect) onSelect(suggestion);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="input w-full"
        placeholder="Start typing address (min 3 characters)..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {loading && <div className="text-sm text-gray-500 mt-1">Searching...</div>}
      {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
      {suggestions.length > 0 && (
        <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-0"
              onClick={() => handleSelect(s)}
            >
              <div className="font-medium">{s.street}</div>
              <div className="text-xs text-gray-500">{s.city}, {s.state} - {s.pincode}</div>
            </li>
          ))}
        </ul>
      )}
      {!loading && input.length >= 3 && suggestions.length === 0 && !error && (
        <div className="text-sm text-gray-500 mt-1">No addresses found. Type manually.</div>
      )}
    </div>
  );
}