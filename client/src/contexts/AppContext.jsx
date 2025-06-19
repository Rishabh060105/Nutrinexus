import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';

const AppContext = createContext();

const initialState = {
  searchTerm: '',
  categoryTag: '',
  sortBy: 'relevance',
  nutritionGradeFilter: '',
  products: [],
  categories: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  totalCount: 0,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload, page: 1 };
    case 'SET_CATEGORY_TAG':
      return { ...state, categoryTag: action.payload, page: 1 };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload, page: 1 };
    case 'SET_NUTRITION_GRADE_FILTER':
      return { ...state, nutritionGradeFilter: action.payload, page: 1 };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_PRODUCTS':
      return { 
        ...state, 
        products: action.payload.products,
        totalCount: action.payload.count,
        hasMore: action.payload.products.length === 24, // Assuming page size of 24
        loading: false,
        error: null
      };
    case 'APPEND_PRODUCTS':
      return { 
        ...state, 
        products: [...state.products, ...action.payload.products],
        page: state.page + 1,
        hasMore: action.payload.products.length === 24,
        loading: false,
        error: null
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'INCREMENT_PAGE':
      return { ...state, page: state.page + 1 };
    case 'RESET_FILTERS':
      return { 
        ...initialState,
        categories: state.categories
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await apiClient.getCategories();
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
      } catch (error) {
        console.error('Failed to load categories:', error);
        // Use fallback categories if API fails
        dispatch({ type: 'SET_CATEGORIES', payload: [
          'beverages',
          'dairy', 
          'snacks',
          'chocolate',
          'cereals',
          'bread'
        ]});
      }
    };

    loadCategories();
  }, []);

  // Search products when filters change
  useEffect(() => {
    const searchProducts = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        let filteredProducts = [];
        
        const result = await apiClient.searchProducts({
          page: 1,
          pageSize: 24,
          searchTerm: state.searchTerm,
          categoryTag: state.categoryTag,
        });

        filteredProducts = result.products || [];

        console.log('API returned products:', filteredProducts.length);
        console.log('Nutrition grade filter:', state.nutritionGradeFilter);

        // Apply nutrition grade filter client-side
        if (state.nutritionGradeFilter) {
          const beforeFilter = filteredProducts.length;
          filteredProducts = filteredProducts.filter(product => 
            product.nutrition_grades && product.nutrition_grades.toLowerCase() === state.nutritionGradeFilter.toLowerCase()
          );
          console.log(`Filtered from ${beforeFilter} to ${filteredProducts.length} products`);
        }

        // Apply sorting
        filteredProducts = sortProducts(filteredProducts, state.sortBy);

        console.log('Final products to display:', filteredProducts.length);

        dispatch({ 
          type: 'SET_PRODUCTS', 
          payload: { 
            products: filteredProducts, 
            count: result.count 
          } 
        });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };

    searchProducts();
  }, [state.searchTerm, state.categoryTag, state.sortBy, state.nutritionGradeFilter]);

  const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'name_asc':
        return sorted.sort((a, b) => 
          (a.product_name || '').localeCompare(b.product_name || '')
        );
      case 'name_desc':
        return sorted.sort((a, b) => 
          (b.product_name || '').localeCompare(a.product_name || '')
        );
      case 'grade_asc':
        return sorted.sort((a, b) => {
          const gradeA = a.nutrition_grades || 'z';
          const gradeB = b.nutrition_grades || 'z';
          return gradeA.localeCompare(gradeB);
        });
      case 'grade_desc':
        return sorted.sort((a, b) => {
          const gradeA = a.nutrition_grades || '';
          const gradeB = b.nutrition_grades || '';
          return gradeB.localeCompare(gradeA);
        });
      default:
        return sorted;
    }
  };

  const loadMore = async () => {
    if (state.loading || !state.hasMore) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await apiClient.searchProducts({
        page: state.page + 1,
        pageSize: 24,
        searchTerm: state.searchTerm,
        categoryTag: state.categoryTag,
      });

      let filteredProducts = result.products;

      // Apply nutrition grade filter client-side
      if (state.nutritionGradeFilter) {
        filteredProducts = filteredProducts.filter(product => 
          product.nutrition_grades === state.nutritionGradeFilter.toLowerCase()
        );
      }

      // Apply sorting
      filteredProducts = sortProducts(filteredProducts, state.sortBy);

      dispatch({ 
        type: 'APPEND_PRODUCTS', 
        payload: { 
          products: filteredProducts, 
          count: result.count 
        } 
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const actions = {
    setSearchTerm: (term) => dispatch({ type: 'SET_SEARCH_TERM', payload: term }),
    setCategoryTag: (category) => dispatch({ type: 'SET_CATEGORY_TAG', payload: category }),
    setSortBy: (sort) => dispatch({ type: 'SET_SORT_BY', payload: sort }),
    setNutritionGradeFilter: (grade) => dispatch({ type: 'SET_NUTRITION_GRADE_FILTER', payload: grade }),
    clearError: () => dispatch({ type: 'SET_ERROR', payload: null }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    loadMore,
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
