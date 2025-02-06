import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

// **Інтерфейс продукту в кошику**
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string; // Додано підтримку size
  color?: string; // Додано підтримку color
}

// **Інтерфейс для контексту кошика**
interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  fetchCart: () => void;
}

// **Створення контексту**
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  // **Завантаження кошика з бекенду**
  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get<Product[]>('/cart');
      setCart(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart([]); // Уникнення можливості undefined
    }
  };

  // **Додавання товару до кошика**
  const addToCart = async (product: Product) => {
    try {
      const response = await axiosInstance.post('/cart/add', {
        productId: product.id,
        quantity: 1, // Збільшення кількості на 1
      });

      setCart(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  // **Видалення товару з кошика**
  const removeFromCart = async (productId: number) => {
    try {
      const response = await axiosInstance.delete(`/cart/${productId}`);
      setCart(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to remove product from cart:', error);
    }
  };

  // **Очищення всього кошика**
  const clearCart = async () => {
    try {
      await axiosInstance.delete('/cart');
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  // **Завантаження кошика при монтуванні**
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

// **Хук для використання контексту кошика**
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
