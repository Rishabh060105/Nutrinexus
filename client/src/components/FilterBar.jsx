import React from 'react';
import { useApp } from '../contexts/AppContext';

const nutritionGrades = [
  { value: 'a', label: 'A', color: 'bg-success-500 hover:bg-success-600' },
  { value: 'b', label: 'B', color: 'bg-green-400 hover:bg-green-500' },
  { value: 'c', label: 'C', color: 'bg-yellow-400 hover:bg-yellow-500' },
  { value: 'd', label: 'D', color: 'bg-orange-400 hover:bg-orange-500' },
  { value: 'e', label: 'E', color: 'bg-error-500 hover:bg-error-600' },
];

function FilterBar() {
  const { state, actions } = useApp();

  const getResultsText = () => {
    const count = state.totalCount;
    let text = `${count.toLocaleString()} products found`;
    
    if (state.searchTerm) {
      text += ` for "${state.searchTerm}"`;
    }
    
    if (state.categoryTag) {
      text += ` in ${state.categoryTag}`;
    }
    
    return text;
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          
          {/* Results Count */}
          <div className="text-sm text-gray-600">
            {getResultsText()}
          </div>

          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select 
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={state.sortBy}
                onChange={(e) => actions.setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="grade_asc">Nutrition Grade (A-E)</option>
                <option value="grade_desc">Nutrition Grade (E-A)</option>
              </select>
            </div>

            {/* Nutrition Grade Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Grade:</label>
              <div className="flex space-x-1">
                {nutritionGrades.map((grade) => (
                  <button
                    key={grade.value}
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors ${grade.color} text-white ${
                      state.nutritionGradeFilter === grade.value 
                        ? 'ring-2 ring-primary-500 ring-offset-1' 
                        : ''
                    }`}
                    onClick={() => {
                      const newFilter = state.nutritionGradeFilter === grade.value ? '' : grade.value;
                      actions.setNutritionGradeFilter(newFilter);
                    }}
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
