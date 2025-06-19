const BASE_URL = import.meta.env.VITE_OFF_BASE_URL || 'https://world.openfoodfacts.org';

const USER_AGENT = 'FoodExplorer/1.0 (food-explorer@example.com)';

class ApiClient {
  async makeRequest(url, options = {}) {
    try {
      console.log('Making API request to:', url);
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}, url: ${url}`);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response received:', { count: data.count, productsLength: data.products?.length });
      return data;
    } catch (error) {
      console.error('API request failed:', error.message, 'URL:', url);
      throw new Error(`Network error: ${error.message}`);
    }
  }

  async searchProducts({ page = 1, pageSize = 24, searchTerm = '', categoryTag = '' }) {
    const searchUrl = new URL(`${BASE_URL}/cgi/search.pl`);
    
    // Required parameters for v1 API
    searchUrl.searchParams.append('action', 'process');
    searchUrl.searchParams.append('json', '1');
    
    // Add pagination
    searchUrl.searchParams.append('page', page.toString());
    searchUrl.searchParams.append('page_size', pageSize.toString());
    
    // Add fields to return
    searchUrl.searchParams.append('fields', 'code,product_name,brands,images,nutrition_grades,categories_tags,ingredients_text,nutriments');
    
    // Add search terms if provided
    if (searchTerm.trim()) {
      // Check if searchTerm is a barcode (numeric)
      if (/^\d+$/.test(searchTerm.trim())) {
        searchUrl.searchParams.append('search_terms', searchTerm.trim());
        searchUrl.searchParams.append('search_simple', '1');
      } else {
        searchUrl.searchParams.append('search_terms', searchTerm.trim());
        searchUrl.searchParams.append('search_simple', '1');
      }
    }
    
    // Add category filter if provided
    if (categoryTag.trim()) {
      searchUrl.searchParams.append('tagtype_0', 'categories');
      searchUrl.searchParams.append('tag_contains_0', 'contains');
      searchUrl.searchParams.append('tag_0', categoryTag.trim());
    }

    const data = await this.makeRequest(searchUrl.toString());
    
    return {
      products: data.products || [],
      count: data.count || 0,
      page: data.page || 1,
      pageCount: data.page_count || 1,
    };
  }

  async getProduct(barcode) {
    if (!barcode) {
      throw new Error('Barcode is required');
    }

    const productUrl = `${BASE_URL}/api/v0/product/${barcode}.json`;
    const data = await this.makeRequest(productUrl);
    
    if (data.status === 0) {
      throw new Error('Product not found');
    }

    return data.product;
  }

  async getCategories() {
    try {
      // Get a large sample of products to extract categories using v1 API
      const searchUrl = new URL(`${BASE_URL}/cgi/search.pl`);
      searchUrl.searchParams.append('action', 'process');
      searchUrl.searchParams.append('json', '1');
      searchUrl.searchParams.append('page_size', '100');
      searchUrl.searchParams.append('fields', 'categories_tags');
      
      const data = await this.makeRequest(searchUrl.toString());

      const categoriesSet = new Set();
      
      if (data.products && Array.isArray(data.products)) {
        data.products.forEach(product => {
          if (product.categories_tags && Array.isArray(product.categories_tags)) {
            product.categories_tags.forEach(category => {
              // Clean up category tags (remove language prefixes)
              const cleanCategory = category.replace(/^[a-z]{2}:/, '');
              if (cleanCategory && cleanCategory.length > 2 && !cleanCategory.includes(':')) {
                categoriesSet.add(cleanCategory);
              }
            });
          }
        });
      }

      // Convert to array and sort
      const categories = Array.from(categoriesSet)
        .filter(cat => cat && cat.length > 2)
        .sort()
        .slice(0, 50); // Limit to top 50 categories

      return categories.length > 0 ? categories : [
        'beverages',
        'dairy',
        'snacks',
        'chocolate',
        'cereals',
        'bread',
        'fruits',
        'vegetables',
        'meat',
        'fish'
      ];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Return default categories as fallback
      return [
        'beverages',
        'dairy',
        'snacks',
        'chocolate',
        'cereals',
        'bread',
        'fruits',
        'vegetables',
        'meat',
        'fish'
      ];
    }
  }
}

export const apiClient = new ApiClient();
