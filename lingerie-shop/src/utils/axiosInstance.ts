import axios from 'axios';

// Використання змінної середовища для динамічного визначення базового URL бекенду
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://127.0.0.1:8080/api/v1';

// Створюємо інстанс axios для всіх запитів
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Використання глобальної змінної
  headers: {
    'Content-Type': 'application/json', // Формат відправлених даних
  },
});

// 🔹 **Перехоплювач запитів:** Додає токен до заголовків, якщо він є
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Отримання токену з localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Додаємо токен авторизації
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`); // Логування запитів
    return config;
  },
  (error) => {
    console.error('[Request Error]:', error);
    return Promise.reject(error);
  }
);

// 🔹 **Перехоплювач відповідей:** Обробляє відповіді API та помилки
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status}:`, response.data); // Логування відповіді API
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[Response Error ${error.response.status}]:`, error.response.data);

      // 🔴 **Якщо статус 401 (Unauthorized), перенаправляємо на логін**
      if (error.response.status === 401) {
        console.warn('❌ Unauthorized. Redirecting to login...');
        localStorage.removeItem('authToken'); // Видалення токену
        window.location.href = '/sign-in'; // Редірект на сторінку логіну
      }

      // 🔴 **Якщо статус 500 (Internal Server Error)**
      if (error.response.status === 500) {
        console.error('❌ Server error. Please try again later.');
      }

      // 🔴 **Якщо статус 404 (Not Found)**
      if (error.response.status === 404) {
        console.error('⚠ Resource not found.');
      }
    } else {
      console.error('🌐 Network Error:', error.message); // Якщо сервер недоступний
    }

    return Promise.reject(error);
  }
);

// 📌 **Перевірка підключення до бекенду**
(async () => {
  try {
    await axiosInstance.get('/health'); // Додаємо перевірку роботи бекенду
    console.log('✅ Backend is available');
  } catch (error) {
    console.error('🚨 Backend is not responding!');
  }
})();

export default axiosInstance;
