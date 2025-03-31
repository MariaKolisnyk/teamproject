import axiosInstance from '../utils/axiosInstance';

/**
 * 🔹 Реєстрація нового користувача
 * Використовує ендпоінт: `/auth/register`
 * @param userData Об'єкт `{ email, password, name, surname }`
 */
export const registerUser = async (userData: Record<string, any>) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error registering user:', error.message);
    throw error;
  }
};

/**
 * 🔹 Авторизація користувача (логін)
 * Використовує ендпоінт: `/auth/login`
 * @param credentials Об'єкт `{ email, password }`
 */
export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error logging in user:', error.message);
    throw error;
  }
};

/**
 * 🔹 Отримати профіль авторизованого користувача
 * Використовує ендпоінт: `/user/profile/`
 */
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/auth/profile/');
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching user profile:', error.message);
    throw error;
  }
};

/**
 * 🔹 Оновлення профілю користувача
 * Використовує ендпоінт: `/user/profile/`
 * @param profileData Об'єкт із оновленими даними профілю
 */
export const updateUserProfile = async (profileData: Record<string, any>) => {
  try {
    const response = await axiosInstance.put('/auth/profile/', profileData);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error updating user profile:', error.message);
    throw error;
  }
};

/**
 * 🔹 Вихід із системи (видалення токена)
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken'); // Видаляємо токен авторизації
};

/**
 * ❌ Тимчасово вимкнені методи, оскільки бекенд їх не підтримує.
 * Якщо ці методи знадобляться, розкоментуй їх та уточни у бекенду.
 */

// export const getAllUsers = async () => {
//   console.warn("⚠️ This endpoint is not defined in the provided API documentation.");
//   return axiosInstance.get('/users');
// };

// export const getUserById = async (id: number) => {
//   console.warn("⚠️ This endpoint is not defined in the provided API documentation.");
//   return axiosInstance.get(`/users/${id}`);
// };

// export const deleteUser = async (id: number) => {
//   console.warn("⚠️ This endpoint is not defined in the provided API documentation.");
//   return axiosInstance.delete(`/users/${id}`);
// };

// export const getUserByEmail = async (email: string) => {
//   console.warn("⚠️ This endpoint is not defined in the provided API documentation.");
//   return axiosInstance.get(`/users/email/${email}`);
// };
