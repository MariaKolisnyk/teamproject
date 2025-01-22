import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CatalogPage.scss';
import { useFavorites } from '../store/FavoritesContext';
import { useCart } from '../store/CartContext';
import axiosInstance from '../utils/axiosInstance';

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

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    brand: '',
    color: '',
    size: '',
    availability: '',
  });

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get<Product[]>('/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.brand) {
      filtered = filtered.filter((product) => product.brand === filters.brand);
    }

    if (filters.color) {
      filtered = filtered.filter((product) => product.color === filters.color);
    }

    if (filters.size) {
      filtered = filtered.filter((product) => product.size === filters.size);
    }

    if (filters.availability === 'available') {
      filtered = filtered.filter((product) => product.isAvailable);
    }

    if (filters.availability === 'not-available') {
      filtered = filtered.filter((product) => !product.isAvailable);
    }

    setFilteredProducts(filtered);
  };

  const handleFavoriteToggle = (product: Product) => {
    if (favorites.some((fav) => fav.id === product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div className="catalog-page">
      <div className="filters">
        <h3>Filters</h3>

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

        <button className="apply-filters-button" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <div className="product-actions">
              <button
                className={`favorite-button ${favorites.some(
                  (fav) => fav.id === product.id
                ) ? 'favorited' : ''}`}
                onClick={() => handleFavoriteToggle(product)}
              >
                <svg className="icon">
                  <use
                    xlinkHref={`/sprite.svg#${
                      favorites.some((fav) => fav.id === product.id)
                        ? 'heart-filled'
                        : 'heart'
                    }`}
                  />
                </svg>
              </button>
              <button className="add-to-cart-button" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button>
          <svg className="icon">
            <use xlinkHref="/sprite.svg#pagination-left-arrow" />
          </svg>
        </button>
        <span>Page 1 of 10</span>
        <button>
          <svg className="icon">
            <use xlinkHref="/sprite.svg#pagination-right-arrow" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CatalogPage;
