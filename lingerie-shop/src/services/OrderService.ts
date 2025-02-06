import axiosInstance from '../utils/axiosInstance';

/**
 * 🔹 Отримати всі замовлення користувача
 * Використовує ендпоінт: `/order/`
 */
export const getOrders = async () => {
  try {
    const response = await axiosInstance.get('/order/');
    return response.data || []; // Уникнення `undefined`
  } catch (error: any) {
    console.error('❌ Error fetching orders:', error.message);
    return [];
  }
};

/**
 * 🔹 Отримати конкретне замовлення за ID
 * Використовує ендпоінт: `/order/{orderId}/`
 * @param orderId ID замовлення
 */
export const getOrderById = async (orderId: number) => {
  try {
    const response = await axiosInstance.get(`/order/${orderId}/`);
    return response.data || null;
  } catch (error: any) {
    console.error(`❌ Error fetching order with ID ${orderId}:`, error.message);
    return null;
  }
};

/**
 * 🔹 Створити нове замовлення
 * Використовує ендпоінт: `/order/create/`
 * @param orderData Дані для створення замовлення
 */
export const createOrder = async (orderData: Record<string, any>) => {
  try {
    const response = await axiosInstance.post('/order/create/', orderData);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error creating order:', error.message);
    throw error;
  }
};

/**
 * 🔹 Оновити статус замовлення
 * Використовує ендпоінт: `/order/{orderId}/`
 * @param orderId ID замовлення
 * @param status Новий статус замовлення
 */
export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const response = await axiosInstance.put(`/order/${orderId}/`, { status });
    return response.data;
  } catch (error: any) {
    console.error('❌ Error updating order status:', error.message);
    throw error;
  }
};

/**
 * 🔹 Скасувати замовлення
 * Використовує ендпоінт: `/order/{orderId}/cancel/`
 * @param orderId ID замовлення
 */
export const cancelOrder = async (orderId: number) => {
  try {
    const response = await axiosInstance.post(`/order/${orderId}/cancel/`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error canceling order:', error.message);
    throw error;
  }
};
