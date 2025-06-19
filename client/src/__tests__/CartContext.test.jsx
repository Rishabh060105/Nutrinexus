import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';

// Test component to interact with cart context
const TestComponent = () => {
  const { state, actions, getTotalItems } = useCart();

  const testProduct = {
    code: '123',
    product_name: 'Test Product',
    brands: 'Test Brand',
    image_url: 'test.jpg',
    nutrition_grades: 'a',
  };

  return (
    <div>
      <div data-testid="cart-count">{getTotalItems()}</div>
      <div data-testid="cart-open">{state.isOpen ? 'open' : 'closed'}</div>
      
      <button onClick={() => actions.addItem(testProduct)}>
        Add Product
      </button>
      <button onClick={() => actions.removeItem('123')}>
        Remove Product
      </button>
      <button onClick={() => actions.updateQuantity('123', 5)}>
        Update Quantity
      </button>
      <button onClick={() => actions.toggleCart()}>
        Toggle Cart
      </button>
      <button onClick={() => actions.clearCart()}>
        Clear Cart
      </button>

      {state.items.map(item => (
        <div key={item.code} data-testid={`item-${item.code}`}>
          <span>{item.product_name}</span>
          <span data-testid={`quantity-${item.code}`}>{item.quantity}</span>
        </div>
      ))}
    </div>
  );
};

describe('CartContext', () => {
  let mockLocalStorage = {};

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {};
    global.localStorage = {
      getItem: jest.fn((key) => mockLocalStorage[key] || null),
      setItem: jest.fn((key, value) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: jest.fn((key) => {
        delete mockLocalStorage[key];
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add items to cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');

    fireEvent.click(screen.getByText('Add Product'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    expect(screen.getByTestId('item-123')).toBeInTheDocument();
    expect(screen.getByTestId('quantity-123')).toHaveTextContent('1');
  });

  it('should increase quantity when adding existing item', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Add product twice
    fireEvent.click(screen.getByText('Add Product'));
    fireEvent.click(screen.getByText('Add Product'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
    expect(screen.getByTestId('quantity-123')).toHaveTextContent('2');
  });

  it('should remove items from cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Add then remove
    fireEvent.click(screen.getByText('Add Product'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('Remove Product'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.queryByTestId('item-123')).not.toBeInTheDocument();
  });

  it('should update item quantity', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Product'));
    fireEvent.click(screen.getByText('Update Quantity'));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('5');
    expect(screen.getByTestId('quantity-123')).toHaveTextContent('5');
  });

  it('should remove item when quantity is set to 0', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const TestQuantityZero = () => {
      const { actions } = useCart();
      return (
        <button onClick={() => actions.updateQuantity('123', 0)}>
          Set Quantity Zero
        </button>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
        <TestQuantityZero />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Product'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('Set Quantity Zero'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });

  it('should toggle cart open/closed state', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-open')).toHaveTextContent('closed');

    fireEvent.click(screen.getByText('Toggle Cart'));
    expect(screen.getByTestId('cart-open')).toHaveTextContent('open');

    fireEvent.click(screen.getByText('Toggle Cart'));
    expect(screen.getByTestId('cart-open')).toHaveTextContent('closed');
  });

  it('should clear all items from cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Add multiple products
    fireEvent.click(screen.getByText('Add Product'));
    fireEvent.click(screen.getByText('Add Product'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('2');

    fireEvent.click(screen.getByText('Clear Cart'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });

  it('should persist cart to localStorage', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Product'));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'food-explorer-cart',
      expect.stringContaining('Test Product')
    );
  });

  it('should load cart from localStorage on mount', () => {
    const savedCart = JSON.stringify([
      {
        code: '456',
        product_name: 'Saved Product',
        quantity: 3,
      },
    ]);

    localStorage.getItem.mockReturnValue(savedCart);

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
    expect(screen.getByText('Saved Product')).toBeInTheDocument();
  });
});
