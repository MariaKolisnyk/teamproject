import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance'; // HTTP-клієнт для API-запитів
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './Search.scss'; // Стилі для сторінки

// Інтерфейс для опису товару
interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

const Search: React.FC = () => {
  const [query, setQuery] = useState(''); // Стан для пошукового запиту
  const [results, setResults] = useState<Product[]>([]); // Стан для результатів пошуку
  const [loading, setLoading] = useState(false); // Стан завантаження
  const [error, setError] = useState<string | null>(null); // Стан для помилок

  // Функція для пошуку товарів
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Запобігаємо оновленню сторінки

    if (!query) return; // Перевіряємо, чи є введений запит

    setLoading(true); // Встановлюємо стан завантаження
    setError(null); // Очищаємо попередню помилку

    try {
      const response = await axiosInstance.get(`/products/search/?query=${query}`);
      setResults(response.data); // Оновлюємо результати
    } catch (err) {
      setError('Something went wrong. Please try again.'); // Встановлюємо помилку
    } finally {
      setLoading(false); // Приховуємо індикатор завантаження
    }
  };

  return (
    <div className="search-page">
      <h1>Search Products</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter product name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Відображення результатів пошуку */}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && results.length === 0 && query !== '' && (
        <p className="no-results">No results found.</p>
      )}

      <div className="search-results">
        {results.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <img src={product.imageUrl} alt={product.name} className="product-image" />
            </Link>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
              <Link to={`/product/${product.id}`} className="view-product">
                View Product →
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Search;
