import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { apiClient } from '../lib/apiClient';
import ProductDetailModal from '../components/ProductDetailModal';
import LoadingSpinner from '../components/LoadingSpinner';

function ProductDetail() {
  const { barcode } = useParams();
  const [, setLocation] = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!barcode) {
        setError('Invalid barcode');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const productData = await apiClient.getProduct(barcode);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError(error.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]);

  const handleClose = () => {
    setLocation('/');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 flex items-center space-x-4">
          <LoadingSpinner size="lg" />
          <span className="text-lg font-medium text-gray-900">Loading product...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
          <div className="text-error-500 mb-4">
            <i className="fas fa-exclamation-triangle text-4xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={handleClose}
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailModal
      product={product}
      isOpen={true}
      onClose={handleClose}
    />
  );
}

export default ProductDetail;
