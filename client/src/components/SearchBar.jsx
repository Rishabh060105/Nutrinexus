import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

function SearchBar() {
  const { state, actions } = useApp();
  const [localSearchTerm, setLocalSearchTerm] = useState(state.searchTerm);

  // Debounce search term updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      actions.setSearchTerm(localSearchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, actions]);

  // Update local state when external state changes
  useEffect(() => {
    setLocalSearchTerm(state.searchTerm);
  }, [state.searchTerm]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i className="fas fa-search text-gray-400"></i>
      </div>
      <input
        type="text"
        placeholder="Search products by name or barcode..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
