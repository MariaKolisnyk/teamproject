import axiosInstance from '../utils/axiosInstance';

/**
 * Отримати нову колекцію товарів
 * Використовує ендпоінт: /products/new
 * @returns Promise з даними нової колекції
 */
export const getNewCollection = async () => {
  try {
    const response = await axiosInstance.get('/products/new');
    return response.data; // Повертаємо отримані дані
  } catch (error) {
    console.error('Error fetching new collection:', error);
    throw error; // Передаємо помилку далі
  }
};

/**
 * Отримати найкращі товари (Best Sellers)
 * Використовує ендпоінт: /products/bestsellers
 * @returns Promise з даними бестселерів
 */
export const getBestSellers = async () => {
  try {
    const response = await axiosInstance.get('/products/bestsellers');
    return response.data;
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    throw error;
  }
};

/**
 * Отримати товари зі знижками
 * Використовує ендпоінт: /products/on-sales
 * @returns Promise з даними товарів на розпродажу
 */
export const getProductsOnSale = async () => {
  try {
    const response = await axiosInstance.get('/products/on-sales');
    return response.data;
  } catch (error) {
    console.error('Error fetching products on sale:', error);
    throw error;
  }
};

/**
 * Отримати товари для індивідуального пошиття
 * Використовує ендпоінт: /products/tailoring
 * @returns Promise з даними товарів для пошиття
 */
export const getTailoringProducts = async () => {
  try {
    const response = await axiosInstance.get('/products/tailoring');
    return response.data;
  } catch (error) {
    console.error('Error fetching tailoring products:', error);
    throw error;
  }
};

/**
 * Пошук товарів за фільтрами
 * Використовує ендпоінт: /products/search
 * @param filters Об'єкт із фільтрами для пошуку
 * @returns Promise з результатами пошуку
 */
export const searchProducts = async (filters: any) => {
  try {
    const response = await axiosInstance.post('/products/search', filters);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Отримати інформацію про товар за його ID
 * Використовує ендпоінт: /products/{id}
 * @param id Унікальний ідентифікатор товару
 * @returns Promise з інформацією про товар
 */
export const getProductById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};
