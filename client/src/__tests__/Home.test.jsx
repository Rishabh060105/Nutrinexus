import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../contexts/AppContext';
import { CartProvider } from '../contexts/CartContext';
import Home from '../pages/Home';
import { apiClient } from '../lib/apiClient';

// Mock the API client
jest.mock('../lib/apiClient');

// Mock wouter
jest.mock('wouter', () => ({
  useLocation: () => ['/', jest.fn()],
}));

const Providers = ({ children }) => (
  <CartProvider>
    <AppProvider>
      {children}
    </AppProvider>
  </CartProvider>
);

describe('Home Page', () => {
  beforeEach(() => {
    apiClient.searchProducts.mockResolvedValue({
      products: [],
      count: 0,
      page: 1,
      pageCount: 1,
    });
    apiClient.getCategories.mockResolvedValue(['chocolate', 'beverages']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the home page with filter bar', async () => {
    render(
      <Providers>
        <Home />
      </Providers>
    );

    await waitFor(() => {
      expect(screen.getByText(/products found/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Sort by:/i)).toBeInTheDocument();
    expect(screen.getByText(/Grade:/i)).toBeInTheDocument();
  });

  it('should display products when available', async () => {
    const mockProducts = [
      {
        code: '123',
        product_name: 'Test Chocolate',
        brands: 'Test Brand',
        nutrition_grades: 'a',
        images: { front_small_url: 'test.jpg' },
        categories_tags: ['en:chocolate'],
      },
    ];

    apiClient.searchProducts.mockResolvedValue({
      products: mockProducts,
      count: 1,
      page: 1,
      pageCount: 1,
    });

    render(
      <Providers>
        <Home />
      </Providers>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Chocolate')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Brand')).toBeInTheDocument();
  });

  it('should display error message when API fails', async () => {
    const errorMessage = 'Failed to load products';
    apiClient.searchProducts.mockRejectedValue(new Error(errorMessage));

    render(
      <Providers>
        <Home />
      </Providers>
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should show no results message when no products found', async () => {
    apiClient.searchProducts.mockResolvedValue({
      products: [],
      count: 0,
      page: 1,
      pageCount: 1,
    });

    render(
      <Providers>
        <Home />
      </Providers>
    );

    await waitFor(() => {
      expect(screen.getByText(/No products found/i)).toBeInTheDocument();
    });
  });

  it('should apply sorting correctly', async () => {
    const mockProducts = [
      {
        code: '123',
        product_name: 'Zebra Product',
        nutrition_grades: 'c',
      },
      {
        code: '456',
        product_name: 'Apple Product',
        nutrition_grades: 'a',
      },
    ];

    apiClient.searchProducts.mockResolvedValue({
      products: mockProducts,
      count: 2,
    });

    render(
      <Providers>
        <Home />
      </Providers>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Zebra Product')).toBeInTheDocument();
    });

    // Change sort to name ascending
    const sortSelect = screen.getByDisplayValue('Relevance');
    fireEvent.change(sortSelect, { target: { value: 'name_asc' } });

    await waitFor(() => {
      const products = screen.getAllByRole('heading', { level: 3 });
      expect(products[0]).toHaveTextContent('Apple Product');
      expect(products[1]).toHaveTextContent('Zebra Product');
    });
  });
});
