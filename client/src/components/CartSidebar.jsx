import React from 'react';
import { useCart } from '../contexts/CartContext';

function CartSidebar() {
  const { state, actions, getTotalItems } = useCart();

  if (!state.isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      actions.closeCart();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 flex flex-col">
        
        {/* Cart Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={actions.closeCart}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-shopping-cart text-4xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 text-sm">Add some products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.code} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img 
                    src={item.image_url || 'https://via.placeholder.com/80x80?text=No+Image'}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                    }}
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {item.product_name}
                    </h4>
                    <p className="text-gray-600 text-xs">
                      {item.brands?.split(',')[0] || 'Unknown Brand'}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                          onClick={() => actions.updateQuantity(item.code, item.quantity - 1)}
                        >
                          <i className="fas fa-minus text-xs"></i>
                        </button>
                        <span className="text-sm font-medium min-w-[2ch] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                          onClick={() => actions.updateQuantity(item.code, item.quantity + 1)}
                        >
                          <i className="fas fa-plus text-xs"></i>
                        </button>
                      </div>
                      <button 
                        className="text-error-500 hover:text-error-600"
                        onClick={() => actions.removeItem(item.code)}
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-medium text-gray-900">Total Items:</span>
              <span className="text-base font-bold text-gray-900">{getTotalItems()}</span>
            </div>
            
            <button 
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              onClick={() => {
                alert('Checkout functionality would be implemented here');
              }}
            >
              Proceed to Checkout
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartSidebar;
