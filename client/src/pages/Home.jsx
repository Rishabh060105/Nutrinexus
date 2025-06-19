import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import FilterBar from '../components/FilterBar';
import ProductGrid from '../components/ProductGrid';
import BarcodeSearch from '../components/BarcodeSearch';

function Home() {
  const { state, actions } = useApp();

  return (
    <>
      <FilterBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BarcodeSearch />
        {state.error && (
          <div className="mb-6 bg-error-50 border border-error-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-error-500 mr-3"></i>
              <div>
                <h3 className="text-sm font-medium text-error-800">Error</h3>
                <p className="text-sm text-error-700 mt-1">{state.error}</p>
              </div>
              <button
                className="ml-auto text-error-400 hover:text-error-600"
                onClick={actions.clearError}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        <ProductGrid
          products={state.products}
          loading={state.loading}
          hasMore={state.hasMore}
          onLoadMore={actions.loadMore}
        />
      </div>
    </>
  );
}

export default Home;
