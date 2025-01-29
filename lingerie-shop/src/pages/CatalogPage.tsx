import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CatalogPage.scss'; // Імпорт стилів сторінки
import { useFavorites } from '../store/FavoritesContext'; // Контекст обраних товарів
import { useCart } from '../store/CartContext'; // Контекст для роботи з кошиком
import axiosInstance from '../utils/axiosInstance'; // HTTP-клієнт для роботи з API

// Типи для об'єкта товару
interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  isAvailable: boolean;
  brand: string;
  size: string;
  color: string;
}

// Типи для об'єкта фільтрів, що отримуються з бекенду
interface Filters {
  brands: string[];
  colors: string[];
  sizes: string[];
  minPrice: number;
  maxPrice: number;
}

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Усі продукти
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Відфільтровані продукти
  const [filters, setFilters] = useState<Filters>({
    brands: [],
    colors: [],
    sizes: [],
    minPrice: 0,
    maxPrice: 1000,
  }); // Фільтри, отримані з бекенду
  const [selectedFilters, setSelectedFilters] = useState({
    brand: '',
    color: '',
    size: '',
    availability: '',
    minPrice: 0,
    maxPrice: 1000,
  }); // Вибрані фільтри

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites(); // Контекст обраних товарів
  const { addToCart } = useCart(); // Контекст роботи з кошиком

  // **Отримання товарів з бекенду**
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get<Product[]>('/api/v1/products/');
        setProducts(response.data); // Збереження отриманих товарів
        setFilteredProducts(response.data); // Початковий стан - всі товари
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  // **Отримання фільтрів з бекенду**
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axiosInstance.get<Filters>('/api/v1/products/filters/');
        setFilters(response.data); // Збереження отриманих фільтрів
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      }
    };

    fetchFilters();
  }, []);

  // **Функція застосування фільтрів**
  const applyFilters = () => {
    let filtered = [...products];

    // Фільтр за брендом
    if (selectedFilters.brand) {
      filtered = filtered.filter((product) => product.brand === selectedFilters.brand);
    }

    // Фільтр за кольором
    if (selectedFilters.color) {
      filtered = filtered.filter((product) => product.color === selectedFilters.color);
    }

    // Фільтр за розміром
    if (selectedFilters.size) {
      filtered = filtered.filter((product) => product.size === selectedFilters.size);
    }

    // Фільтр за доступністю
    if (selectedFilters.availability === 'available') {
      filtered = filtered.filter((product) => product.isAvailable);
    } else if (selectedFilters.availability === 'not-available') {
      filtered = filtered.filter((product) => !product.isAvailable);
    }

    // Фільтр за ціновим діапазоном
    filtered = filtered.filter(
      (product) =>
        product.price >= selectedFilters.minPrice && product.price <= selectedFilters.maxPrice
    );

    setFilteredProducts(filtered);
  };

  return (
    <div className="catalog-page">
      {/* Фільтри */}
      <div className="filters">
        <h3>Filters</h3>

        {/* Фільтр за брендом */}
        <div className="filter-section">
          <h4>Brand</h4>
          <select onChange={(e) => setSelectedFilters({ ...selectedFilters, brand: e.target.value })}>
            <option value="">All</option>
            {filters.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Фільтр за кольором */}
        <div className="filter-section">
          <h4>Color</h4>
          <select onChange={(e) => setSelectedFilters({ ...selectedFilters, color: e.target.value })}>
            <option value="">All</option>
            {filters.colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Фільтр за розміром */}
        <div className="filter-section">
          <h4>Size</h4>
          <select onChange={(e) => setSelectedFilters({ ...selectedFilters, size: e.target.value })}>
            <option value="">All</option>
            {filters.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Фільтр за ціною */}
        <div className="filter-section">
          <h4>Price</h4>
          <div className="price-filter">
            <input
              type="number"
              placeholder="Min"
              value={selectedFilters.minPrice}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, minPrice: +e.target.value })}
            />
            <input
              type="number"
              placeholder="Max"
              value={selectedFilters.maxPrice}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, maxPrice: +e.target.value })}
            />
          </div>
        </div>

        {/* Кнопка застосування фільтрів */}
        <button className="apply-filters-button" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>

      {/* Сітка продуктів */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <div className="product-actions">
              <button
                className={`favorite-button ${
                  favorites.some((fav) => fav.id === product.id) ? 'favorited' : ''
                }`}
                onClick={() =>
                  favorites.some((fav) => fav.id === product.id)
                    ? removeFromFavorites(product.id)
                    : addToFavorites(product)
                }
              >
                ❤
              </button>
              <button className="add-to-cart-button" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
