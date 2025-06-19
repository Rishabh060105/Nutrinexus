import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useLocation } from 'wouter';

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

function ProductCard({ product }) {
  const { actions: cartActions } = useCart();
  const [, setLocation] = useLocation();

  const handleCardClick = (e) => {
    // Don't navigate if clicking the add to cart button
    if (e.target.closest('button')) return;
    setLocation(`/product/${product.code}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    cartActions.addItem(product);
  };

  // Get the best available image URL
  const getImageUrl = (product) => {
    const images = product.images || {};
    
    // Try different image sizes in order of preference
    if (images.front_small_url) return images.front_small_url;
    if (images.front_url) return images.front_url;
    if (images.front_thumb_url) return images.front_thumb_url;
    
    // Construct image URL from product code if no direct URL available
    if (product.code) {
      const code = product.code;
      const folder1 = code.slice(0, 3);
      const folder2 = code.slice(3, 6);
      const folder3 = code.slice(6, 9);
      return `https://images.openfoodfacts.org/images/products/${folder1}/${folder2}/${folder3}/${code}/front_small.jpg`;
    }
    
    // Create a more appealing placeholder
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <circle cx="150" cy="80" r="25" fill="#d1d5db"/>
        <rect x="110" y="120" width="80" height="8" rx="4" fill="#d1d5db"/>
        <rect x="125" y="140" width="50" height="6" rx="3" fill="#e5e7eb"/>
      </svg>
    `)}`;
  };

  const imageUrl = getImageUrl(product);

  const productName = product.product_name || 'Unknown Product';
  const brandName = product.brands?.split(',')[0] || 'Unknown Brand';
  const nutritionGrade = product.nutrition_grades?.toUpperCase() || '';
  const category = product.categories_tags?.[0]?.replace(/^[a-z]{2}:/, '') || 'Food';

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={imageUrl}
          alt={productName}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            // Use the same SVG placeholder as the fallback
            e.target.src = `data:image/svg+xml,${encodeURIComponent(`
              <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <circle cx="150" cy="80" r="25" fill="#d1d5db"/>
                <rect x="110" y="120" width="80" height="8" rx="4" fill="#d1d5db"/>
                <rect x="125" y="140" width="50" height="6" rx="3" fill="#e5e7eb"/>
              </svg>
            `)}`;
          }}
        />
        
        {/* Nutrition Grade Badge */}
        {nutritionGrade && (
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getNutritionGradeColor(nutritionGrade)}`}>
              {nutritionGrade}
            </span>
          </div>
        )}

        {/* Add to Cart Button */}
        <button 
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow opacity-0 group-hover:opacity-100"
          onClick={handleAddToCart}
          title="Add to cart"
        >
          <i className="fas fa-plus text-primary-600"></i>
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
          {productName}
        </h3>
        <p className="text-gray-600 text-xs mb-2">
          {brandName}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Nutri-Score:</span>
            <span className={`text-xs font-bold ${
              nutritionGrade ? 
                nutritionGrade === 'A' ? 'text-success-600' :
                nutritionGrade === 'B' ? 'text-green-600' :
                nutritionGrade === 'C' ? 'text-yellow-600' :
                nutritionGrade === 'D' ? 'text-orange-600' :
                nutritionGrade === 'E' ? 'text-error-600' :
                'text-gray-600'
              : 'text-gray-400'
            }`}>
              {nutritionGrade || 'N/A'}
            </span>
          </div>
          <span className="text-xs text-gray-500 capitalize">
            {category}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
