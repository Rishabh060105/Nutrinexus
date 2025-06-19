const BASE_URL = '/api/food';

const USER_AGENT = 'FoodExplorer/1.0 (food-explorer@example.com)';

class ApiClient {
  async makeRequest(url, options = {}) {
    try {
      console.log('Making API request to:', url);
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}, url: ${url}`);
        throw new Error(`API request failed: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
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
    const searchUrl = new URL(`${BASE_URL}/search`, window.location.origin);
    
    // Add pagination
    searchUrl.searchParams.append('page', page.toString());
    searchUrl.searchParams.append('page_size', pageSize.toString());
    
    // Add search terms if provided
    if (searchTerm.trim()) {
      searchUrl.searchParams.append('search_terms', searchTerm.trim());
    }
    
    // Add category filter if provided
    if (categoryTag.trim()) {
      searchUrl.searchParams.append('categories_tags', categoryTag.trim());
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

    const productUrl = `${BASE_URL}/product/${barcode}`;
    const data = await this.makeRequest(productUrl);
    
    if (data.status === 0) {
      throw new Error('Product not found');
    }

    return data.product;
  }

  async getCategories() {
    try {
      const categoriesUrl = `${BASE_URL}/categories`;
      const data = await this.makeRequest(categoriesUrl);
      return data.categories || [
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
