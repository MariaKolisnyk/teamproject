import axiosInstance from '../utils/axiosInstance';

/**
 * Отримати всі категорії товарів
 * @returns Promise з відповіддю від API
 */
export const getAllCategories = async () => {
  return axiosInstance.get('/categories'); // Видалено локальний URL
};

/**
 * Отримати доступні кольори товарів
 * Переконайтеся, що цей ендпоінт існує у Swagger
 */
export const getColors = async () => {
  try {
    return await axiosInstance.get('/colors');
  } catch (error) {
    console.error('Failed to fetch colors:', error);
    return { data: [] }; // Повертаємо порожній масив у разі помилки
  }
};

/**
 * Отримати доступні розміри товарів
 * Переконайтеся, що цей ендпоінт існує у Swagger
 */
export const getSizes = async () => {
  try {
    return await axiosInstance.get('/sizes');
  } catch (error) {
    console.error('Failed to fetch sizes:', error);
    return { data: [] }; // Повертаємо порожній масив у разі помилки
  }
};
