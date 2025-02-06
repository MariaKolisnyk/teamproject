import axios from 'axios';

// 🔹 **Оновлений BASE_URL** (без `/api/v1/`)
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://127.0.0.1:8080';

// Створюємо інстанс axios для всіх запитів
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`, // Додаємо `/api/v1` тут, щоб уникнути помилки з подвійним `/api/v1/api/v1/`
  headers: {
    'Content-Type': 'application/json', // Формат відправлених даних
  },
});

// 🔹 **Перехоплювач запитів:** Додає токен до заголовків
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

// 🔹 **Перехоплювач відповідей:** Обробка помилок API
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status}:`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[Response Error ${error.response.status}]:`, error.response.data);

      // 🛑 **Якщо 401 (Unauthorized), перенаправляємо на логін, але тільки у браузері**
      if (error.response.status === 401) {
        console.warn('❌ Unauthorized. Redirecting to login...');
        localStorage.removeItem('authToken'); // Видаляємо токен
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in';
        }
      }

      // 🛑 **Якщо 500 (Internal Server Error)**
      if (error.response.status === 500) {
        console.error('❌ Server error. Please try again later.');
      }

      // 🛑 **Якщо 404 (Not Found)**
      if (error.response.status === 404) {
        console.error('⚠ Resource not found.');
      }
    } else {
      console.error('🌐 Network Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// 📌 **Перевірка бекенду (оновлено)**
(async () => {
  try {
    const response = await axiosInstance.get('/products'); // ✅ Перевіряємо API
    if (response.status === 200) {
      console.log('✅ Backend is available');
    }
  } catch (error) {
    console.error('🚨 Backend is not responding!');
  }
})();

export default axiosInstance;
