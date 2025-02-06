import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb'; // Навігація
import { useCart } from '../store/CartContext'; // Контекст кошика
import './ProductPage.scss'; // Стилі сторінки
import axiosInstance from '../utils/axiosInstance'; // HTTP-запити

// **Інтерфейс продукту**
interface Product {
  id: number;
  name: string;
  image: string; // ✅ Використовуємо image замість imageUrl
  price: number;
  description: string;
  laundryCare: string[];
  colorOptions: string[];
  sizes: string[];
  rating: number;
}

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>(); // Отримання ID продукту з URL
  const [product, setProduct] = useState<Product | null>(null); // Стан продукту
  const [quantity, setQuantity] = useState(1); // Кількість обраного продукту
  const [selectedColor, setSelectedColor] = useState<string | null>(null); // Обраний колір
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // Обраний розмір
  const [error, setError] = useState<string | null>(null); // Повідомлення про помилки
  const [isLoading, setIsLoading] = useState(true); // Стан завантаження
  const { addToCart } = useCart(); // Функція додавання до кошика

  // 🔥 **Отримання даних про продукт**
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get<Product>(`/products/${productId}`);
        setProduct(response.data);
        setSelectedColor(response.data.colorOptions?.[0] || null); // ✅ Вибираємо перший доступний колір
        setSelectedSize(response.data.sizes?.[0] || null); // ✅ Вибираємо перший доступний розмір
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // 🔥 **Функція для зміни кількості товару**
  const handleQuantityChange = (operation: 'increment' | 'decrement') => {
    setQuantity((prev) => (operation === 'increment' ? prev + 1 : Math.max(1, prev - 1)));
  };

  // 🔥 **Функція для додавання товару до кошика**
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
        image: product.image, // ✅ Передаємо image, а не imageUrl
        quantity,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>; // Відображення стану завантаження
  if (error) return <div className="error-message">{error}</div>; // Відображення помилки
  if (!product) return null; // Якщо продукт не знайдено

  return (
    <div className="product-page">
      {/* 🔥 **Навігація (Breadcrumb)** */}
      <Breadcrumb
        paths={[
          { label: 'Home', path: '/' },
          { label: 'Catalog', path: '/catalog' },
          { label: product.name, path: `/product/${product.id}` },
        ]}
      />

      {/* 🔥 **Основний контейнер продукту** */}
      <div className="product-container">
        {/* 🔥 **Зображення продукту** */}
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

        {/* 🔥 **Деталі продукту** */}
        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="product-code">Code: {product.id}</p>

          {/* 🔥 **Кольори** */}
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

          {/* 🔥 **Розміри** */}
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

          {/* 🔥 **Ціна** */}
          <div className="product-price">
            <h4>Price</h4>
            <p>${product.price.toFixed(2)}</p>
          </div>

          {/* 🔥 **Селектор кількості** */}
          <div className="quantity-selector">
            <button onClick={() => handleQuantityChange('decrement')}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange('increment')}>+</button>
          </div>

          {/* 🔥 **Кнопка додавання до кошика** */}
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            ADD TO CART
          </button>
        </div>
      </div>

      {/* 🔥 **Опис продукту** */}
      <div className="product-description">
        <h3>Description</h3>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductPage;
