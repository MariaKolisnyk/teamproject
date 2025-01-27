import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Для навігації між сторінками
import './CatalogPage.scss'; // Імпорт стилів
import { useFavorites } from '../store/FavoritesContext'; // Контекст обраних товарів
import { useCart } from '../store/CartContext'; // Контекст для роботи з кошиком
import axiosInstance from '../utils/axiosInstance'; // HTTP-клієнт для запитів до API

// Тип для опису товару
interface Product {
  id: number; // Унікальний ідентифікатор продукту
  name: string; // Назва продукту
  imageUrl: string; // Посилання на зображення продукту
  price: number; // Ціна продукту
  isAvailable: boolean; // Чи доступний продукт
  brand: string; // Бренд продукту
  size: string; // Розмір продукту
  color: string; // Колір продукту
}

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Список усіх продуктів
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Відфільтровані продукти
  const [filters, setFilters] = useState({
    brand: '', // Фільтр за брендом
    color: '', // Фільтр за кольором
    size: '', // Фільтр за розміром
    availability: '', // Фільтр за доступністю
    minPrice: 0, // Мінімальна ціна
    maxPrice: 1000, // Максимальна ціна
  });

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites(); // Контекст обраного
  const { addToCart } = useCart(); // Контекст для роботи з кошиком

  // Завантаження продуктів із бекенду
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get<Product[]>('/products');
        setProducts(response.data); // Збереження усіх продуктів
        setFilteredProducts(response.data); // Початковий стан — всі продукти
      } catch (error) {
        console.error('Failed to fetch products:', error); // Логування помилок
      }
    };

    fetchProducts(); // Виклик функції
  }, []);

  // Фільтрація продуктів
  const applyFilters = () => {
    let filtered = [...products];

    // Фільтр за брендом
    if (filters.brand) {
      filtered = filtered.filter((product) => product.brand === filters.brand);
    }

    // Фільтр за кольором
    if (filters.color) {
      filtered = filtered.filter((product) => product.color === filters.color);
    }

    // Фільтр за розміром
    if (filters.size) {
      filtered = filtered.filter((product) => product.size === filters.size);
    }

    // Фільтр за доступністю
    if (filters.availability === 'available') {
      filtered = filtered.filter((product) => product.isAvailable);
    } else if (filters.availability === 'not-available') {
      filtered = filtered.filter((product) => !product.isAvailable);
    }

    // Фільтр за ціною
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    setFilteredProducts(filtered); // Оновлення стану відфільтрованих продуктів
  };

  // Оновлення значення фільтра ціни
  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: number) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="catalog-page">
      {/* Фільтри */}
      <div className="filters">
        <h3>Filters</h3>
        {/* Фільтр за брендом */}
        <div className="filter-section">
          <h4>Brand</h4>
          <select
            onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
          >
            <option value="">All</option>
            <option value="Brand A">Brand A</option>
            <option value="Brand B">Brand B</option>
          </select>
        </div>
        {/* Фільтр за кольором */}
        <div className="filter-section">
          <h4>Color</h4>
          <select
            onChange={(e) => setFilters((prev) => ({ ...prev, color: e.target.value }))}
          >
            <option value="">All</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
          </select>
        </div>
        {/* Фільтр за розміром */}
        <div className="filter-section">
          <h4>Size</h4>
          <select
            onChange={(e) => setFilters((prev) => ({ ...prev, size: e.target.value }))}
          >
            <option value="">All</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>
        </div>
        {/* Фільтр за доступністю */}
        <div className="filter-section">
          <h4>Availability</h4>
          <select
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, availability: e.target.value }))
            }
          >
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="not-available">Not Available</option>
          </select>
        </div>
        {/* Фільтр за ціною */}
        <div className="filter-section">
          <h4>Price</h4>
          <div className="price-filter">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange('minPrice', +e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', +e.target.value)}
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
              <button
                className="add-to-cart-button"
                onClick={() => addToCart(product)}
              >
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
