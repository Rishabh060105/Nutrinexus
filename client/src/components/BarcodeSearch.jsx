import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

function BarcodeSearch() {
  const { actions } = useApp();
  const [barcode, setBarcode] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleBarcodeSearch = async () => {
    if (!barcode.trim()) return;
    
    setIsSearching(true);
    try {
      // Clear existing search and set the barcode as search term
      actions.clearFilters();
      actions.setSearchTerm(barcode.trim());
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBarcodeSearch();
    }
  };

  const handleClear = () => {
    setBarcode('');
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <i className="fas fa-barcode text-blue-600"></i>
        <h3 className="text-sm font-medium text-blue-900">Barcode Search</h3>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-barcode text-gray-400"></i>
          </div>
          <input
            type="text"
            placeholder="Enter product barcode (e.g., 3017620422003)"
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value.replace(/\D/g, ''))} // Only allow numbers
            onKeyDown={handleKeyDown}
            maxLength="13" // Standard barcode length
          />
          {barcode && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              type="button"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        
        <button
          onClick={handleBarcodeSearch}
          disabled={!barcode.trim() || isSearching}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors border border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
          type="button"
        >
          {isSearching ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Search</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <i className="fas fa-search"></i>
              <span>Search</span>
            </div>
          )}
        </button>
      </div>
      
      <div className="mt-2 text-xs text-blue-600">
        <i className="fas fa-info-circle mr-1"></i>
        Enter a 13-digit barcode to find specific products instantly
      </div>
    </div>
  );
}

export default BarcodeSearch;