import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../store/FavoritesContext'; // Імпортуємо контекст обраного
import { useCart } from '../store/CartContext'; // Імпортуємо контекст кошика
import '../styles.scss'; // Підключення SCSS файлу

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { favorites } = useFavorites(); // Отримання даних обраного з контексту
  const { cart } = useCart(); // Отримання даних кошика з контексту

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <header className="header">
      {/* Верхня частина хедера */}
      <div className="header-top">
        <div className="container">
          <div className="header-left">
            <Link to="/">
              <img src="/images/LOGO.png" alt="Lingerie Logo" className="header-logo" />
            </Link>
            <button className="menu-button" onClick={toggleMenu}>
              <img src="/images/components-icon.png" alt="Menu Icon" className="menu-icon" />
              <span>Menu</span>
            </button>
          </div>
          <div className="header-right">
            <Link to="/search">
              <img src="/images/search-icon.png" alt="Search" />
            </Link>
            <Link to="/profile">
              <img src="/images/user-icon.png" alt="Profile" />
            </Link>
            {/* Іконка Favorites з кількістю */}
            <Link to="/favorites" className="favorite-icon">
              <img src="/images/favorite-icon.png" alt="Favorites" />
              {favorites.length > 0 && (
                <span className="badge">{favorites.length}</span>
              )}
            </Link>
            {/* Іконка корзини з кількістю */}
            <Link to="/cart" className="cart-icon">
              <img src="/images/cart-icon.png" alt="Cart" />
              {cart.length > 0 && (
                <span className="badge">{cart.length}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Горизонтальне меню категорій */}
      <div className="header-categories">
        <div className="container">
          <nav>
            <Link to="/new">NEW</Link>
            <Link to="/sale">SALE</Link>
            <Link to="/bras">BRAS</Link>
            <Link to="/panties">PANTIES</Link>
            <Link to="/sets">SETS</Link>
            <Link to="/swimwear">SWIMWEAR</Link>
            <Link to="/sleepwear">SLEEPWEAR</Link>
            <Link to="/home-linen">HOME LINEN</Link>
            <Link to="/individual-tailoring">INDIVIDUAL TAILORING</Link>
          </nav>
        </div>
      </div>

      {/* Випадаюче меню */}
      {menuVisible && (
        <div className="menu-container">
          <div className="menu-content">
            <button className="close-button" onClick={toggleMenu}>✕</button>
            <ul>
              <li><Link to="/catalog">Catalog</Link></li>
              <li><Link to="/new">New Arrivals</Link></li>
              <li><Link to="/sale">Sale</Link></li>
              <li><Link to="/bras">Bras</Link></li>
              <li><Link to="/panties">Panties</Link></li>
              <li><Link to="/swimwear">Swimwear</Link></li>
              <li><Link to="/sleepwear">Sleepwear</Link></li>
              <li><Link to="/home-linen">Home Linen</Link></li>
              <li><Link to="/individual-tailoring">Individual Tailoring</Link></li>
              <li><Link to="/sign-in">Sign In</Link></li>
              <li><Link to="/sign-up">Sign Up</Link></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
