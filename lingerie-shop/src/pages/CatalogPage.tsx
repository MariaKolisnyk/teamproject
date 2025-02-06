import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Навігація між сторінками
import './CatalogPage.scss'; // Стилі сторінки
import { useFavorites } from '../store/FavoritesContext'; // Контекст обраних товарів
import { useCart } from '../store/CartContext'; // Контекст кошика
import axiosInstance from '../utils/axiosInstance'; // Інстанс axios

// **Інтерфейси**
interface Color {
  id: number;
  name: string;
}

interface Size {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  image?: string; // Поле для сумісності з кошиком
  price: number;
  isAvailable: boolean;
  brand: string;
  size?: string;
  color?: string;
  quantity?: number;
  category?: string;
}

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | 'All'>('All');
  const [selectedSize, setSelectedSize] = useState<string | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  // **Отримання кольорів з API**
  const fetchColors = async () => {
    try {
      const response = await axiosInstance.get('/color/');
      const colorData = Array.isArray(response.data) ? response.data : [];
      setColors(colorData);
    } catch (err) {
      console.error('Error fetching colors:', err);
      setColors([]); // У разі помилки встановлюємо порожній масив
    }
  };

  // **Отримання розмірів з API**
  const fetchSizes = async () => {
    try {
      const response = await axiosInstance.get('/size/');
      const sizeData = Array.isArray(response.data) ? response.data : [];
      setSizes(sizeData);
    } catch (err) {
      console.error('Error fetching sizes:', err);
      setSizes([]); // У разі помилки встановлюємо порожній масив
    }
  };

  // **Отримання категорій з API**
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories/');
      const categoryData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoryData);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]); // У разі помилки встановлюємо порожній масив
    }
  };

  // **Отримання товарів з API**
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<Product[]>('/products/');
      const updatedProducts = response.data.map((product) => ({
        ...product,
        image: product.imageUrl,
        quantity: 1,
      }));
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  // **Фільтрація товарів**
  useEffect(() => {
    let filtered = products;

    if (selectedColor !== 'All') {
      filtered = filtered.filter((product) => product.color === selectedColor);
    }

    if (selectedSize !== 'All') {
      filtered = filtered.filter((product) => product.size === selectedSize);
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [selectedColor, selectedSize, selectedCategory, products]);

  // **Завантаження даних при першому рендері**
  useEffect(() => {
    fetchColors();
    fetchSizes();
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div className="catalog-page">
      <h1 className="catalog-title">Catalog</h1>

      {/* 🔥 **Фільтри** */}
      <div className="filters">
        {/* Фільтр за кольором */}
        <div className="filter-section">
          <h4>Color</h4>
          <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
            <option value="All">All Colors</option>
            {colors.map((color) => (
              <option key={color.id} value={color.name}>
                {color.name}
              </option>
            ))}
          </select>
        </div>

        {/* Фільтр за розміром */}
        <div className="filter-section">
          <h4>Size</h4>
          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="All">All Sizes</option>
            {sizes.map((size) => (
              <option key={size.id} value={size.name}>
                {size.name}
              </option>
            ))}
          </select>
        </div>

        {/* Фільтр за категорією */}
        <div className="filter-section">
          <h4>Category</h4>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🔥 **Стан завантаження або помилка** */}
      {loading && <p>Loading products...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* 🔥 **Відображення товарів** */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>

              <p><strong>Color:</strong> {product.color || 'N/A'}</p>
              <p><strong>Size:</strong> {product.size || 'N/A'}</p>

              <div className="product-actions">
                {/* ❤️ Додавання до обраного */}
                <button
                  className={`favorite-button ${favorites.some((fav) => fav.id === product.id) ? 'favorited' : ''}`}
                  onClick={() =>
                    favorites.some((fav) => fav.id === product.id)
                      ? removeFromFavorites(product.id)
                      : addToFavorites({ ...product, image: product.imageUrl })
                  }
                >
                  ❤
                </button>

                {/* 🛒 Додавання до кошика */}
                <button
                  className="add-to-cart-button"
                  onClick={() => addToCart({ ...product, image: product.imageUrl, quantity: 1 })}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
