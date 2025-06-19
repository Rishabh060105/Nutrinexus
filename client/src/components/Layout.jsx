import React from 'react';
import { Link } from 'wouter';
import { useCart } from '../contexts/CartContext';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import CartSidebar from './CartSidebar';

function Layout({ children }) {
  const { state: cartState, actions: cartActions, getTotalItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Link href="/">
                  <h1 className="text-xl font-bold text-gray-900 cursor-pointer hover:text-primary-600 transition-colors">
                    <i className="fas fa-apple-alt text-primary-600 mr-2"></i>
                    Food Explorer
                  </h1>
                </Link>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            {/* Category Filter & Cart */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <CategoryFilter />
              </div>

              {/* Shopping Cart */}
              <button 
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={cartActions.toggleCart}
              >
                <i className="fas fa-shopping-cart text-xl"></i>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search & Category */}
          <div className="md:hidden pb-4 space-y-3">
            <SearchBar />
            <CategoryFilter />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="col-span-1 md:col-span-2">
              <Link href="/">
                <h3 className="text-lg font-bold text-gray-900 mb-4 cursor-pointer hover:text-primary-600 transition-colors">
                  <i className="fas fa-apple-alt text-primary-600 mr-2"></i>
                  Food Explorer
                </h3>
              </Link>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Discover and explore food products with detailed nutrition information, 
                ingredients, and health scores powered by OpenFoodFacts.
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-primary-600 transition-colors">
                  <i className="fab fa-twitter text-lg"></i>
                </button>
                <button className="text-gray-400 hover:text-primary-600 transition-colors">
                  <i className="fab fa-facebook text-lg"></i>
                </button>
                <button className="text-gray-400 hover:text-primary-600 transition-colors">
                  <i className="fab fa-instagram text-lg"></i>
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary-600 transition-colors">Product Search</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Nutrition Analysis</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Barcode Scanner</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Category Filters</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="https://world.openfoodfacts.org" className="hover:text-primary-600 transition-colors">OpenFoodFacts</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Contribute Data</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 Food Explorer. Data provided by{' '}
              <a 
                href="https://world.openfoodfacts.org" 
                className="text-primary-600 hover:text-primary-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenFoodFacts
              </a>
              .
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}

export default Layout;
