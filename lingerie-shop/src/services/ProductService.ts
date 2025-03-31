import { AxiosInstance } from "axios";
import axiosInstance from '../utils/axiosInstance'; // Використовуємо axios екземпляр

class ProductService {
  // Замість конструктора з axiosInstance, ми безпосередньо будемо використовувати axiosInstance
  constructor() {}

  // Метод для отримання нової колекції
  async getNewCollection(filters: Record<string, any> = {}) {
    try {
      const response = await axiosInstance.get('/products/new', { params: filters });
      return response.data || [];
    } catch (error: any) {
      console.error('❌ Error fetching new collection:', error.message);
      return [];
    }
  }

  // Метод для отримання найкращих товарів (Best Sellers)
  async getBestSellers(filters: Record<string, any> = {}) {
    try {
      const response = await axiosInstance.get('/products/top-sales', { params: filters });
      return response.data || [];
    } catch (error: any) {
      console.error('❌ Error fetching best sellers:', error.message);
      return [];
    }
  }

  // Отримання товарів зі знижками
  async getProductsOnSale(filters: Record<string, any> = {}) {
    try {
      const response = await axiosInstance.get('/products/on-sales', { params: filters });
      return response.data || [];
    } catch (error: any) {
      console.error('❌ Error fetching products on sale:', error.message);
      return [];
    }
  }

  // Інші методи, якщо потрібно, додавайте тут
}

export const productService = new ProductService();
