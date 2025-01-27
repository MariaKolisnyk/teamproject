import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb'; // Компонент для відображення навігації
import { useCart } from '../store/CartContext'; // Контекст для управління кошиком
import './ProductPage.scss'; // Імпорт стилів сторінки
import axiosInstance from '../utils/axiosInstance'; // HTTP-запити

// Опис інтерфейсу продукту
interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  laundryCare: string[]; // Інструкції по догляду
  colorOptions: string[]; // Варіанти кольорів
  sizes: string[]; // Варіанти розмірів
  rating: number; // Рейтинг продукту
}

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>(); // Отримання ID продукту з параметрів URL
  const [product, setProduct] = useState<Product | null>(null); // Стан для продукту
  const [quantity, setQuantity] = useState(1); // Кількість обраного продукту
  const [selectedColor, setSelectedColor] = useState<string | null>(null); // Обраний колір
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // Обраний розмір
  const [error, setError] = useState<string | null>(null); // Повідомлення про помилки
  const [isLoading, setIsLoading] = useState(true); // Стан завантаження
  const { addToCart } = useCart(); // Функції контексту кошика

  // Завантаження даних продукту
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get<Product>(`/products/${productId}`);
        setProduct(response.data);
        setSelectedColor(response.data.colorOptions[0]); // Перший колір за замовчуванням
        setSelectedSize(response.data.sizes[0]); // Перший розмір за замовчуванням
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Зміна кількості товару
  const handleQuantityChange = (operation: 'increment' | 'decrement') => {
    setQuantity((prev) => (operation === 'increment' ? prev + 1 : Math.max(1, prev - 1)));
  };

  // Додавання продукту до кошика
  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      setError('Please select a color and size before adding to cart.');
      return;
    }
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Відображення стану завантаження
  }

  if (error) {
    return <div className="error-message">{error}</div>; // Відображення помилки
  }

  if (!product) {
    return null; // Якщо продукт не знайдено
  }

  return (
    <div className="product-page">
      {/* Breadcrumb для навігації */}
      <Breadcrumb
        paths={[
          { label: 'Home', path: '/' },
          { label: 'Catalog', path: '/catalog' },
          { label: product.name, path: `/product/${product.id}` },
        ]}
      />

      {/* Основний контейнер продукту */}
      <div className="product-container">
        {/* Зображення продукту */}
        <div className="product-images">
          <div className="thumbnail-list">
            {product.colorOptions.map((color, index) => (
              <img
                key={index}
                src={`/assets/images/products/${color}.png`}
                alt={`Thumbnail ${color}`}
                className={`thumbnail ${selectedColor === color ? 'active' : ''}`}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
          <img src={product.image} alt={product.name} className="main-image" />
        </div>

        {/* Деталі продукту */}
        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="product-code">Code: {product.id}</p>

          {/* Кольори */}
          <div className="product-colors">
            <h4>Colour</h4>
            <div className="color-options">
              {product.colorOptions.map((color, index) => (
                <span
                  key={index}
                  className={`color-dot ${selectedColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                ></span>
              ))}
            </div>
          </div>

          {/* Розміри */}
          <div className="product-sizes">
            <h4>Size</h4>
            <div className="size-options">
              {product.sizes.map((size, index) => (
                <span
                  key={index}
                  className={`size-option ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          {/* Ціна */}
          <div className="product-price">
            <h4>Price</h4>
            <p>${product.price.toFixed(2)}</p>
          </div>

          {/* Селектор кількості */}
          <div className="quantity-selector">
            <button onClick={() => handleQuantityChange('decrement')}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange('increment')}>+</button>
          </div>

          {/* Кнопка додавання до кошика */}
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Опис продукту */}
      <div className="product-description">
        <h3>Description</h3>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductPage;
