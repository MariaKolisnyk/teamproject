import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CatalogPage.scss';
import { useFavorites } from '../store/FavoritesContext';
import { useCart } from '../store/CartContext';
import axiosInstance from '../utils/axiosInstance';

// Інтерфейси
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
  const [colors, setColors] = useState<Color[]>([]); // Стан для кольорів
  const [sizes, setSizes] = useState<Size[]>([]); // Стан для розмірів
  const [categories, setCategories] = useState<Category[]>([]); // Стан для категорій
  const [selectedColor, setSelectedColor] = useState<string | 'All'>('All');
  const [selectedSize, setSelectedSize] = useState<string | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  // Отримання кольорів, розмірів та категорій з API
  const fetchFilters = async () => {
    try {
      const [colorResponse, sizeResponse, categoryResponse] = await Promise.all([
        axiosInstance.get('/color/'),
        axiosInstance.get('/size/'),
        axiosInstance.get('/categories/')
      ]);

      // Перевірка, чи отримані дані для кольорів є масивом
      if (Array.isArray(colorResponse.data.results)) {
        setColors(colorResponse.data.results);
      } else {
        setColors([]); // Якщо дані не масив, зберігаємо порожній масив
        console.error('Colors data is not an array');
      }

      setSizes(sizeResponse.data);
      setCategories(categoryResponse.data);
    } catch (err) {
      setColors([]); // У разі помилки обнуляємо стан кольорів
      console.error('Error fetching filters:', err);
    }
  };

  // Отримання товарів з API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<Product[]>('/products/');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  // Фільтрація товарів за вибором
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

  // Завантаження даних при першому рендері
  useEffect(() => {
    fetchFilters();
    fetchProducts();
  }, []);

  return (
    <div className="catalog-page">
      <h1 className="catalog-title">Catalog of Sets</h1>

      {/* Фільтри */}
      <div className="filters">
        <div className="filter-section">
          <h4>Color</h4>
          <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
            <option value="All">All Colors</option>
            {Array.isArray(colors) && colors.map((color) => (
              <option key={color.id} value={color.name}>
                {color.name}
              </option>
            ))}
          </select>
        </div>

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

      {/* Стан завантаження або помилка */}
      {loading && <p>Loading products...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Відображення товарів */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
              <div className="product-actions">
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
                <button className="add-to-cart-button" onClick={() => addToCart({ ...product, image: product.imageUrl, quantity: 1 })}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products found.</p>
        )}
      </div>

      {/* Банер перед футером */}
      <div className="banner">
        <img src="/images/banner.png" alt="Banner" />
      </div>
    </div>
  );
};

export default CatalogPage;
