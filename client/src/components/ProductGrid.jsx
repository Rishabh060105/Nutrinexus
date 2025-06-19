import React from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

function ProductGrid({ products, loading, hasMore, onLoadMore }) {
  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Loading Skeleton */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
            <div className="bg-gray-200 h-48"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <i className="fas fa-search text-6xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search terms or filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.code || Math.random()} product={product} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button 
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              <>
                Load More Products
                <i className="fas fa-chevron-down ml-2"></i>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}

export default ProductGrid;
