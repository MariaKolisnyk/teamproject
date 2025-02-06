import axiosInstance from '../utils/axiosInstance';

/**
 * Отримати нову колекцію товарів
 * Використовує ендпоінт: /products/new
 */
export const getNewCollection = async () => {
  try {
    const response = await axiosInstance.get('/products/new');
    return response.data || [];
  } catch (error: any) {
    console.error('❌ Error fetching new collection:', error.message);
    return [];
  }
};

/**
 * Отримати найкращі товари (Best Sellers)
 * Використовує ендпоінт: /products/bestsellers
 */
export const getBestSellers = async () => {
  try {
    const response = await axiosInstance.get('/products/bestsellers');
    return response.data || [];
  } catch (error: any) {
    console.error('❌ Error fetching best sellers:', error.message);
    return [];
  }
};

/**
 * Отримати товари зі знижками
 * Використовує ендпоінт: /products/on-sales
 */
export const getProductsOnSale = async () => {
  try {
    const response = await axiosInstance.get('/products/on-sales');
    return response.data || [];
  } catch (error: any) {
    console.error('❌ Error fetching products on sale:', error.message);
    return [];
  }
};

/**
 * Отримати товари для індивідуального пошиття
 * Використовує ендпоінт: /products/tailoring
 */
export const getTailoringProducts = async () => {
  try {
    const response = await axiosInstance.get('/products/tailoring');
    return response.data || [];
  } catch (error: any) {
    console.error('❌ Error fetching tailoring products:', error.message);
    return [];
  }
};

/**
 * Пошук товарів за фільтрами
 * Використовує ендпоінт: /products/search
 * @param filters Об'єкт із фільтрами для пошуку
 */
export const searchProducts = async (filters: Record<string, any>) => {
  try {
    const response = await axiosInstance.post('/products/search', filters);
    if (response.status === 200) {
      return response.data || [];
    }
    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error: any) {
    console.error('❌ Error searching products:', error.message);
    return [];
  }
};

/**
 * Отримати інформацію про товар за його ID
 * Використовує ендпоінт: /products/{id}
 * @param id Унікальний ідентифікатор товару
 */
export const getProductById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    if (response.status === 200) {
      return response.data || null;
    }
    throw new Error(`Product not found (ID: ${id})`);
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`⚠️ Product with ID ${id} not found.`);
      return null;
    }
    console.error(`❌ Error fetching product with ID ${id}:`, error.message);
    return null;
  }
};
