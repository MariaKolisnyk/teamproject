import axiosInstance from '../utils/axiosInstance';

/**
 * 🔹 Отримати всі товари у кошику
 * Використовує ендпоінт: `/cart/`
 */
export const getCartItems = async () => {
  try {
    const response = await axiosInstance.get('/cart/');
    return response.data || []; // Уникнення `undefined`
  } catch (error: any) {
    console.error('❌ Error fetching cart items:', error.message);
    return [];
  }
};

/**
 * 🔹 Додати товар до кошика
 * Використовує ендпоінт: `/cart/add/`
 * @param productId ID продукту
 * @param quantity Кількість товару
 */
export const addToCart = async (productId: number, quantity: number) => {
  try {
    const response = await axiosInstance.post('/cart/add/', { productId, quantity });
    return response.data;
  } catch (error: any) {
    console.error('❌ Error adding to cart:', error.message);
    throw error;
  }
};

/**
 * 🔹 Видалити товар із кошика
 * Використовує ендпоінт: `/cart/remove/{productId}`
 * @param productId ID товару
 */
export const removeFromCart = async (productId: number) => {
  try {
    const response = await axiosInstance.delete(`/cart/remove/${productId}`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error removing cart item:', error.message);
    throw error;
  }
};

/**
 * 🔹 Очистити весь кошик
 * Використовує ендпоінт: `/cart/clear/`
 */
export const clearCart = async () => {
  try {
    const response = await axiosInstance.delete('/cart/clear/');
    return response.data;
  } catch (error: any) {
    console.error('❌ Error clearing cart:', error.message);
    throw error;
  }
};

/**
 * 🔹 Застосувати промокод
 * Використовує ендпоінт: `/cart/apply-promo/`
 * @param promoCode Промокод, який вводить користувач
 */
export const applyPromoCode = async (promoCode: string) => {
  try {
    const response = await axiosInstance.post('/cart/apply-promo/', { promoCode });
    return response.data;
  } catch (error: any) {
    console.error('❌ Error applying promo code:', error.message);
    throw error;
  }
};

/**
 * ❌ Тимчасово вимкнений метод `updateCartItem`, оскільки у бекенді немає такого ендпоінта.
 */
// export const updateCartItem = async (productId: number, quantity: number) => {
//   try {
//     const response = await axiosInstance.put('/cart/update/', { productId, quantity });
//     return response.data;
//   } catch (error: any) {
//     console.error('❌ Error updating cart item:', error.message);
//     throw error;
//   }
// };
