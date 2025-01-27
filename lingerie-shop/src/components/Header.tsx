import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MiniCart from './MiniCart'; // Випадаюче меню кошика
import CartIcon from './CartIcon'; // Іконка кошика
import { useFavorites } from '../store/FavoritesContext'; // Контекст обраного
import { useCart } from '../store/CartContext'; // Контекст кошика
import '../styles.scss'; // Загальні стилі

const Header: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false); // Стан для відкриття/закриття меню
  const [isMiniCartOpen, setMiniCartOpen] = useState(false); // Стан для відкриття/закриття MiniCart
  const { favorites } = useFavorites(); // Отримання обраних товарів з контексту
  const { cart } = useCart(); // Отримання товарів з кошика

  // Відкриття/закриття меню
  const toggleMenu = () => setMenuVisible((prev) => !prev);

  // Відкриття/закриття MiniCart
  const toggleMiniCart = () => setMiniCartOpen((prev) => !prev);

  // Закриття меню при кліку на посилання
  const closeMenu = () => setMenuVisible(false);

  return (
    <header className="header">
      {/* Верхня частина хедера */}
      <div className="header-top">
        <div className="container">
          {/* Ліва частина: логотип і меню */}
          <div className="header-left">
            {/* Логотип, який веде на головну сторінку */}
            <Link to="/">
              <img src="/images/LOGO.png" alt="Lingerie Logo" className="header-logo" />
            </Link>
            {/* Кнопка для відкриття горизонтального меню */}
            <button className="menu-button" onClick={toggleMenu}>
              <img src="/images/components-icon.png" alt="Menu Icon" className="menu-icon" />
              <span>Menu</span>
            </button>
          </div>

          {/* Права частина: пошук, профіль, обране та кошик */}
          <div className="header-right">
            {/* Іконка пошуку */}
            <Link to="/search">
              <img src="/images/search-icon.png" alt="Search" />
            </Link>
            {/* Іконка профілю */}
            <Link to="/profile">
              <img src="/images/user-icon.png" alt="Profile" />
            </Link>
            {/* Іконка обраного зі значком кількості */}
            <Link to="/favorites" className="favorite-icon">
              <img src="/images/favorite-icon.png" alt="Favorites" />
              {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
            </Link>
            {/* Іконка кошика з відкриттям MiniCart */}
            <div onClick={toggleMiniCart}>
              <CartIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Горизонтальне меню категорій */}
      <div className="header-categories">
        <div className="container">
          <nav>
            {/* Посилання на сторінки категорій */}
            <Link to="/new" onClick={closeMenu}>NEW</Link>
            <Link to="/sale" onClick={closeMenu}>SALE</Link>
            <Link to="/bras" onClick={closeMenu}>BRAS</Link>
            <Link to="/panties" onClick={closeMenu}>PANTIES</Link>
            <Link to="/sets" onClick={closeMenu}>SETS</Link>
            <Link to="/swimwear" onClick={closeMenu}>SWIMWEAR</Link>
            <Link to="/sleepwear" onClick={closeMenu}>SLEEPWEAR</Link>
            <Link to="/home-linen" onClick={closeMenu}>HOME LINEN</Link>
            <Link to="/individual-tailoring" onClick={closeMenu}>INDIVIDUAL TAILORING</Link>
            <Link to="/cart" onClick={closeMenu}>CART</Link> {/* Додано посилання на "CART" */}
          </nav>
        </div>
      </div>

      {/* Випадаюче меню MiniCart */}
      {isMiniCartOpen && <MiniCart onClose={toggleMiniCart} />}

      {/* Випадаюче меню для мобільних пристроїв */}
      {menuVisible && (
        <div className="menu-container">
          <div className="menu-content">
            {/* Кнопка для закриття меню */}
            <button className="close-button" onClick={toggleMenu}>✕</button>
            <ul>
              {/* Посилання на сторінки */}
              <li><Link to="/catalog" onClick={closeMenu}>Catalog</Link></li>
              <li><Link to="/new" onClick={closeMenu}>New Arrivals</Link></li>
              <li><Link to="/sale" onClick={closeMenu}>Sale</Link></li>
              <li><Link to="/bras" onClick={closeMenu}>Bras</Link></li>
              <li><Link to="/panties" onClick={closeMenu}>Panties</Link></li>
              <li><Link to="/swimwear" onClick={closeMenu}>Swimwear</Link></li>
              <li><Link to="/sleepwear" onClick={closeMenu}>Sleepwear</Link></li>
              <li><Link to="/home-linen" onClick={closeMenu}>Home Linen</Link></li>
              <li><Link to="/individual-tailoring" onClick={closeMenu}>Individual Tailoring</Link></li>
              <li><Link to="/cart" onClick={closeMenu}>Cart</Link></li> {/* Додано пункт "Cart" */}
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
