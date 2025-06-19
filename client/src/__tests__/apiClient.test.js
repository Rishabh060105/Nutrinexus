import { apiClient } from '../lib/apiClient';

// Mock fetch
global.fetch = jest.fn();

describe('ApiClient', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('searchProducts', () => {
    it('should make a request with correct parameters', async () => {
      const mockResponse = {
        products: [{ code: '123', product_name: 'Test Product' }],
        count: 1,
        page: 1,
        page_count: 1,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.searchProducts({
        searchTerm: 'chocolate',
        categoryTag: 'snacks',
        page: 1,
        pageSize: 24,
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search_terms=chocolate'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': 'FoodExplorer/1.0 (food-explorer@example.com)',
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle barcode search', async () => {
      const mockResponse = {
        products: [{ code: '123456789', product_name: 'Barcode Product' }],
        count: 1,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await apiClient.searchProducts({
        searchTerm: '123456789',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('code=123456789'),
        expect.any(Object)
      );
    });

    it('should handle API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        apiClient.searchProducts({ searchTerm: 'test' })
      ).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('getProduct', () => {
    it('should fetch product by barcode', async () => {
      const mockProduct = {
        code: '123456789',
        product_name: 'Test Product',
        brands: 'Test Brand',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 1,
          product: mockProduct,
        }),
      });

      const result = await apiClient.getProduct('123456789');

      expect(fetch).toHaveBeenCalledWith(
        'https://world.openfoodfacts.org/api/v0/product/123456789.json',
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': 'FoodExplorer/1.0 (food-explorer@example.com)',
          }),
        })
      );

      expect(result).toEqual(mockProduct);
    });

    it('should throw error for product not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 0,
          status_verbose: 'product not found',
        }),
      });

      await expect(
        apiClient.getProduct('nonexistent')
      ).rejects.toThrow('Product not found');
    });

    it('should throw error for missing barcode', async () => {
      await expect(
        apiClient.getProduct('')
      ).rejects.toThrow('Barcode is required');
    });
  });

  describe('getCategories', () => {
    it('should return unique categories from products', async () => {
      const mockResponse = {
        products: [
          { categories_tags: ['en:chocolate', 'en:snacks'] },
          { categories_tags: ['en:beverages', 'en:sodas'] },
          { categories_tags: ['en:chocolate'] },
        ],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.getCategories();

      expect(result).toContain('chocolate');
      expect(result).toContain('snacks');
      expect(result).toContain('beverages');
      expect(result).toContain('sodas');
      expect(result.length).toBeLessThanOrEqual(50);
    });

    it('should return default categories on error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await apiClient.getCategories();

      expect(result).toContain('beverages');
      expect(result).toContain('dairy');
      expect(result).toContain('snacks');
    });
  });
});
