import React from 'react';
import { Link } from 'react-router-dom'; // Додаємо можливість переходу на сторінку товару
import { useFavorites } from '../store/FavoritesContext'; // Контекст для роботи з обраними товарами
import './Favorites.scss';

const Favorites: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites(); // Деструктуризація контексту

  return (
    <div className="favorites-page">
      <h2>Your Favorites</h2>

      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <div key={product.id} className="favorite-card">
              {/* Додаємо посилання на сторінку товару */}
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} className="favorite-image" />
              </Link>

              <div className="favorite-info">
                <Link to={`/product/${product.id}`} className="favorite-name">
                  {product.name}
                </Link>
                <p className="favorite-price">${product.price.toFixed(2)}</p>
              </div>

              {/* Кнопка видалення з обраного */}
              <button
                className="remove-button"
                onClick={() => removeFromFavorites(product.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">No favorites added yet!</p>
      )}
    </div>
  );
};

export default Favorites;
