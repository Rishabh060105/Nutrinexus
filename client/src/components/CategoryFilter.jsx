import React from 'react';
import { useApp } from '../contexts/AppContext';

function CategoryFilter() {
  const { state, actions } = useApp();

  const formatCategoryName = (category) => {
    return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="relative">
      <select 
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        value={state.categoryTag}
        onChange={(e) => actions.setCategoryTag(e.target.value)}
      >
        <option value="">All Categories</option>
        {state.categories.map((category) => (
          <option key={category} value={category}>
            {formatCategoryName(category)}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <i className="fas fa-chevron-down text-gray-400"></i>
      </div>
    </div>
  );
}

export default CategoryFilter;
