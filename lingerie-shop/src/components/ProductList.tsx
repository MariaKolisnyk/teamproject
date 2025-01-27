import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Для переходу на сторінку ProductPage
import axiosInstance from '../utils/axiosInstance'; // Використання axios для запитів
import { useCart } from '../store/CartContext'; // Контекст для роботи з кошиком
import './ProductList.scss'; // Стилі для компонента

// Інтерфейс для опису продукту
interface Product {
  id: number; // Унікальний ідентифікатор продукту
  name: string; // Назва продукту
  image: string; // Поле для зображення, використовується в кошику
  imageUrl: string; // Поле зображення, яке приходить із бекенда
  price: number; // Ціна продукту
  description?: string; // Опис продукту (необов'язковий параметр)
  quantity: number; // Кількість продукту
}

// Основний компонент списку продуктів
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Стан для продуктів
  const [isLoading, setIsLoading] = useState<boolean>(true); // Стан для завантаження
  const [error, setError] = useState<string | null>(null); // Стан для помилок
  const { addToCart } = useCart(); // Функція додавання продукту до кошика з контексту

  // Завантаження продуктів із бекенда
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // HTTP-запит для отримання продуктів
        const response = await axiosInstance.get<Product[]>('/products');
        // Додаткове поле `image` для відповідності даним у контексті кошика
        const updatedProducts = response.data.map((product) => ({
          ...product,
          image: product.imageUrl, // Дублюємо поле imageUrl у image
          quantity: 0, // Початкове значення кількості
        }));
        setProducts(updatedProducts); // Зберігаємо отримані дані в стані
      } catch (err) {
        // У разі помилки встановлюємо текст помилки
        setError('Failed to fetch products. Please try again.');
      } finally {
        // Завершуємо стан завантаження
        setIsLoading(false);
      }
    };

    fetchProducts(); // Виклик функції
  }, []); // Ефект виконується лише один раз при монтуванні компонента

  // Якщо дані завантажуються, показуємо спінер
  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  // Якщо сталася помилка, показуємо повідомлення
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Якщо список продуктів порожній
  if (!products.length) {
    return <div className="no-products">No products available.</div>;
  }

  // Основне відображення списку продуктів
  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          {/* Посилання на сторінку продукту */}
          <Link to={`/product/${product.id}`}>
            <img src={product.imageUrl} alt={product.name} className="product-image" />
          </Link>
          <div className="product-info">
            {/* Назва продукту як посилання */}
            <Link to={`/product/${product.id}`} className="product-link">
              <h3 className="product-name">{product.name}</h3>
            </Link>
            {/* Опис продукту (якщо є) */}
            {product.description && <p className="product-description">{product.description}</p>}
            {/* Ціна продукту */}
            <p className="product-price">${product.price.toFixed(2)}</p>
          </div>
          {/* Кнопка для додавання до кошика */}
          <button
            className="add-to-cart-button"
            onClick={() =>
              addToCart({
                ...product,
                image: product.imageUrl, // Передаємо поле image
                quantity: 1, // Додаємо продукт із кількістю 1
              })
            }
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
