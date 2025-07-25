import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { apiClient } from '../lib/apiClient';

function BarcodeSearch() {
  const { actions } = useApp();
  const [barcode, setBarcode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');

  const handleBarcodeSearch = async () => {
    if (!barcode.trim()) return;
    
    setIsSearching(true);
    setError('');
    setSearchResult(null);
    
    try {
      // Use direct product lookup for barcode search
      const product = await apiClient.getProduct(barcode.trim());
      
      if (product) {
        // Create a single-product result and update the app state
        const singleProductResult = {
          products: [product],
          count: 1
        };
        
        // Use the dedicated barcode result action
        actions.setBarcodeResult(singleProductResult);
        setSearchResult(product);
      }
    } catch (err) {
      setError('Product not found for this barcode. Please check the barcode and try again.');
      console.error('Barcode search error:', err);
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
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
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
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </div>
          )}
        </button>
      </div>
      
      <div className="mt-2">
        {error && (
          <div className="text-xs text-red-600 mb-2">
            <i className="fas fa-exclamation-circle mr-1"></i>
            {error}
          </div>
        )}
        {searchResult && (
          <div className="text-xs text-green-600 mb-2">
            <i className="fas fa-check-circle mr-1"></i>
            Found product: {searchResult.product_name || 'Unknown Product'}
          </div>
        )}
        <div className="text-xs text-blue-600">
          <i className="fas fa-info-circle mr-1"></i>
          Enter a 13-digit barcode to find specific products instantly
        </div>
      </div>
    </div>
  );
}

export default BarcodeSearch;