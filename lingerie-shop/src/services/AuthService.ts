import axiosInstance from '../utils/axiosInstance';

/**
 * 🔹 Логін користувача
 * Використовує ендпоінт: `/auth/login`
 * @param credentials Об'єкт з `email` і `password`
 * @returns Promise з даними авторизації (токен тощо)
 */
export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data; // Повертаємо отримані дані (токен, user)
  } catch (error) {
    console.error('❌ Error logging in:', error);
    throw error; // Передаємо помилку далі
  }
};

/**
 * 🔹 Реєстрація нового користувача
 * Використовує ендпоінт: `/auth/register`
 * @param userData Об'єкт з `email`, `password`, `name`, `surname`
 * @returns Promise з даними реєстрації (токен, user ID тощо)
 */
export const registerUser = async (userData: { email: string; password: string; name: string; surname: string }) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data; // Повертаємо отримані дані
  } catch (error) {
    console.error('❌ Error registering user:', error);
    throw error; // Передаємо помилку далі
  }
};

/**
 * 🔹 Вихід користувача (лог-аут)
 * Видаляє токен зі `localStorage` та очищає сесію
 */
export const logoutUser = () => {
  localStorage.removeItem('token'); // Видаляємо токен з локального сховища
  console.log('✅ User logged out successfully');
};

/**
 * 🔹 Отримання профілю користувача
 * Використовує ендпоінт: `/user/profile/`
 * @returns Promise з даними користувача
 */
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/user/profile/');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    throw error;
  }
};
