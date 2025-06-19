import React from 'react';
import { useCart } from '../contexts/CartContext';

const getNutritionGradeColor = (grade) => {
  switch (grade?.toLowerCase()) {
    case 'a': return 'bg-success-500 text-white';
    case 'b': return 'bg-green-400 text-white';
    case 'c': return 'bg-yellow-400 text-white';
    case 'd': return 'bg-orange-400 text-white';
    case 'e': return 'bg-error-500 text-white';
    default: return 'bg-gray-400 text-white';
  }
};

function ProductDetailModal({ product, isOpen, onClose }) {
  const { actions: cartActions } = useCart();

  if (!isOpen || !product) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    cartActions.addItem(product);
    cartActions.openCart();
  };

  const handleShare = async () => {
    const shareData = {
      title: product.product_name,
      text: `Check out this product: ${product.product_name}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Product link copied to clipboard!');
      });
    }
  };

  const imageUrl = product.images?.front_url || 
                   product.images?.front_small_url || 
                   'https://via.placeholder.com/400x300?text=No+Image';

  const productName = product.product_name || 'Unknown Product';
  const brandName = product.brands?.split(',')[0] || 'Unknown Brand';
  const nutritionGrade = product.nutrition_grades?.toUpperCase() || '';
  const category = product.categories_tags?.[0]?.replace(/^[a-z]{2}:/, '') || 'Food';
  const ingredients = product.ingredients_text || 'Ingredients information not available.';

  // Parse nutrition data
  const nutrition = product.nutriments || {};
  const nutritionData = [
    { label: 'Energy', value: nutrition.energy_100g ? `${Math.round(nutrition.energy_100g)} kJ` : 'N/A' },
    { label: 'Fat', value: nutrition.fat_100g ? `${nutrition.fat_100g}g` : 'N/A' },
    { label: 'Saturated fat', value: nutrition['saturated-fat_100g'] ? `${nutrition['saturated-fat_100g']}g` : 'N/A' },
    { label: 'Carbohydrates', value: nutrition.carbohydrates_100g ? `${nutrition.carbohydrates_100g}g` : 'N/A' },
    { label: 'Sugars', value: nutrition.sugars_100g ? `${nutrition.sugars_100g}g` : 'N/A' },
    { label: 'Fiber', value: nutrition.fiber_100g ? `${nutrition.fiber_100g}g` : 'N/A' },
    { label: 'Protein', value: nutrition.proteins_100g ? `${nutrition.proteins_100g}g` : 'N/A' },
    { label: 'Salt', value: nutrition.salt_100g ? `${nutrition.salt_100g}g` : 'N/A' },
  ];

  // Parse labels
  const labels = product.labels_tags || [];
  const displayLabels = labels
    .map(label => label.replace(/^[a-z]{2}:/, ''))
    .filter(label => label && !label.includes(':'))
    .slice(0, 6);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
            {productName}
          </h2>
          <button 
            className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4"
            onClick={onClose}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Product Image & Basic Info */}
            <div>
              <img 
                src={imageUrl}
                alt={productName}
                className="w-full h-64 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-medium">{brandName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Barcode:</span>
                      <span className="font-mono text-xs">{product.code}</span>
                    </div>
                    {nutritionGrade && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Nutri-Score:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getNutritionGradeColor(nutritionGrade)}`}>
                          {nutritionGrade}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Labels */}
                {displayLabels.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Labels</h4>
                    <div className="flex flex-wrap gap-2">
                      {displayLabels.map((label, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 capitalize"
                        >
                          {label.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Information */}
            <div className="space-y-6">
              
              {/* Ingredients */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {ingredients}
                </p>
              </div>

              {/* Nutrition Facts */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Nutrition Facts <span className="text-sm font-normal text-gray-500">(per 100g)</span>
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {nutritionData.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{item.label}:</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button 
                  className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  onClick={handleAddToCart}
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Add to Cart
                </button>
                <button 
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  onClick={handleShare}
                >
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
