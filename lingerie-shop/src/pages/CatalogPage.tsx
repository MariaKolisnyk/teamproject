import React, { useState, useEffect } from 'react';
import './CatalogPage.scss';
import { useFavorites } from '../store/FavoritesContext'; // Імпорт контексту обраних товарів
import { useCart } from '../store/CartContext'; // Імпорт контексту кошика
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
  price: number;
  isAvailable: boolean;
  brand: string;
  size?: string;
  color?: string;
  quantity?: number;
  category?: string;
}

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Список продуктів
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Фільтровані продукти
  const [colors, setColors] = useState<Color[]>([]); // Кольори
  const [sizes, setSizes] = useState<Size[]>([]); // Розміри
  const [categories, setCategories] = useState<Category[]>([]); // Категорії
  const [selectedColor, setSelectedColor] = useState<string | 'All'>('All'); // Вибір кольору
  const [selectedSize, setSelectedSize] = useState<string | 'All'>('All'); // Вибір розміру
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All'); // Вибір категорії
  const [loading, setLoading] = useState(true); // Стан завантаження
  const [error, setError] = useState<string | null>(null); // Стан помилки

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites(); // Функції для роботи з обраними товарами
  const { addToCart } = useCart(); // Функція для роботи з кошиком

  // Отримуємо кольори, розміри, категорії з API
  const fetchFilters = async () => {
    try {
      const [colorResponse, sizeResponse, categoryResponse] = await Promise.all([
        axiosInstance.get('/color/'),
        axiosInstance.get('/size/'),
        axiosInstance.get('/categories/')
      ]);
      if (Array.isArray(colorResponse.data)) {
        setColors(colorResponse.data);
      }
      if (Array.isArray(sizeResponse.data)) {
        setSizes(sizeResponse.data);
      }
      if (Array.isArray(categoryResponse.data)) {
        setCategories(categoryResponse.data);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  // Отримуємо продукти з API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<Product[]>('/products/');
      console.log("Fetched Products: ", response.data);  // Додаємо перевірку, чи приходять продукти
      setProducts(response.data);
      setFilteredProducts(response.data); // Задаємо фільтровані продукти одразу після завантаження
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  // Фільтруємо продукти на основі вибору
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

  // Завантажуємо дані при першому рендері
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
            {colors.length > 0 ? (
              colors.map((color) => (
                <option key={color.id} value={color.name}>
                  {color.name}
                </option>
              ))
            ) : (
              <option value="All">No colors available</option>
            )}
          </select>
        </div>

        <div className="filter-section">
          <h4>Size</h4>
          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="All">All Sizes</option>
            {sizes.length > 0 ? (
              sizes.map((size) => (
                <option key={size.id} value={size.name}>
                  {size.name}
                </option>
              ))
            ) : (
              <option value="All">No sizes available</option>
            )}
          </select>
        </div>

        <div className="filter-section">
          <h4>Category</h4>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value="All">No categories available</option>
            )}
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

      {/* Банер перед футером */}
      <div className="banner">
        <img src="/images/banner.png" alt="Banner" />
      </div>
    </div>
  );
};

export default CatalogPage;
