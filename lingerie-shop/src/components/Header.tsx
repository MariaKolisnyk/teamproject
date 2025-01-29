import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CartIcon from './CartIcon'; // Іконка кошика
import { useFavorites } from '../store/FavoritesContext'; // Контекст обраного
import { useCart } from '../store/CartContext'; // Контекст кошика
import '../styles.scss'; // Загальні стилі

// Інтерфейс для пропсів
interface HeaderProps {
  toggleMiniCart: () => void; // Функція для відкриття MiniCart
}

const Header: React.FC<HeaderProps> = ({ toggleMiniCart }) => {
  const { favorites } = useFavorites(); // Отримуємо обрані товари
  const { cart } = useCart(); // Отримуємо товари в кошику
  const [menuVisible, setMenuVisible] = useState(false); // Стан для відкриття/закриття меню

  // Відкриття/закриття меню
  const toggleMenu = () => setMenuVisible((prev) => !prev);

  // Закриття меню при кліку на посилання
  const closeMenu = () => setMenuVisible(false);

  return (
    <header className="header">
      {/* Верхня частина хедера */}
      <div className="header-top">
        <div className="container">
          {/* Ліва частина: логотип та меню */}
          <div className="header-left">
            <Link to="/">
              <img src="/images/LOGO.png" alt="Lingerie Logo" className="header-logo" />
            </Link>
            {/* Кнопка для відкриття мобільного меню */}
            <button className="menu-button" onClick={toggleMenu}>
              <img src="/images/components-icon.png" alt="Menu Icon" className="menu-icon" />
              <span>Menu</span>
            </button>
          </div>

          {/* Права частина: пошук, профіль, обране, кошик */}
          <div className="header-right">
            <Link to="/search">
              <img src="/images/search-icon.png" alt="Search" />
            </Link>
            <Link to="/profile">
              <img src="/images/user-icon.png" alt="Profile" />
            </Link>
            {/* Іконка обраного */}
            <Link to="/favorites" className="favorite-icon">
              <img src="/images/favorite-icon.png" alt="Favorites" />
              {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
            </Link>
            {/* Кнопка кошика без зміни кольору */}
            <button className="cart-button no-highlight" onClick={toggleMiniCart}>
              <CartIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Горизонтальне меню категорій */}
      <div className="header-categories">
        <div className="container">
          <nav>
            <Link to="/new" onClick={closeMenu}>NEW</Link>
            <Link to="/sale" onClick={closeMenu}>SALE</Link>
            <Link to="/bras" onClick={closeMenu}>BRAS</Link>
            <Link to="/panties" onClick={closeMenu}>PANTIES</Link>
            <Link to="/sets" onClick={closeMenu}>SETS</Link>
            <Link to="/swimwear" onClick={closeMenu}>SWIMWEAR</Link>
            <Link to="/sleepwear" onClick={closeMenu}>SLEEPWEAR</Link>
            <Link to="/home-linen" onClick={closeMenu}>HOME LINEN</Link>
            <Link to="/individual-tailoring" onClick={closeMenu}>INDIVIDUAL TAILORING</Link>
            <Link to="/cart" onClick={closeMenu}>CART</Link>
          </nav>
        </div>
      </div>

      {/* Випадаюче меню для мобільних пристроїв */}
      {menuVisible && (
        <div className="menu-container">
          <div className="menu-content">
            {/* Кнопка для закриття меню */}
            <button className="close-button" onClick={toggleMenu}>✕</button>
            <ul>
              <li><Link to="/catalog" onClick={closeMenu}>Catalog</Link></li>
              <li><Link to="/new" onClick={closeMenu}>New Arrivals</Link></li>
              <li><Link to="/sale" onClick={closeMenu}>Sale</Link></li>
              <li><Link to="/bras" onClick={closeMenu}>Bras</Link></li>
              <li><Link to="/panties" onClick={closeMenu}>Panties</Link></li>
              <li><Link to="/swimwear" onClick={closeMenu}>Swimwear</Link></li>
              <li><Link to="/sleepwear" onClick={closeMenu}>Sleepwear</Link></li>
              <li><Link to="/home-linen" onClick={closeMenu}>Home Linen</Link></li>
              <li><Link to="/individual-tailoring" onClick={closeMenu}>Individual Tailoring</Link></li>
              <li><Link to="/cart" onClick={closeMenu}>Cart</Link></li>
              <li><Link to="/sign-in" onClick={closeMenu}>Sign In</Link></li>
              <li><Link to="/sign-up" onClick={closeMenu}>Sign Up</Link></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
