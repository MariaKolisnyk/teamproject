import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HelpDesk from '../pages/HelpDesk'; // Компонент HelpDesk для підтримки користувачів
import { useCart } from '../store/CartContext'; // Контекст для роботи з кошиком
import './CartPage.scss'; // Імпорт стилів

const CartPage: React.FC = () => {
  const { cart, removeFromCart, addToCart } = useCart(); // Доступ до товарів у кошику та функцій керування
  const [promoCode, setPromoCode] = useState(''); // Стан для введеного промокоду
  const [discount, setDiscount] = useState(0); // Стан для розміру знижки
  const [isHelpDeskOpen, setHelpDeskOpen] = useState(false); // Стан для відображення Help Desk

  // Функція для обробки застосування промокоду
  const handleApplyPromoCode = () => {
    if (promoCode === 'DISCOUNT10') {
      setDiscount(10); // Установлюємо знижку 10%
    } else {
      alert('Invalid promo code'); // Повідомлення про неправильний промокод
      setDiscount(0);
    }
  };

  // Розрахунок загальної ціни товарів у кошику
  const totalProductsPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Розрахунок загальної ціни після знижки
  const discountedPrice = totalProductsPrice - (totalProductsPrice * discount) / 100;

  // Функція для відкриття/закриття Help Desk
  const toggleHelpDesk = () => {
    setHelpDeskOpen((prev) => !prev);
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">CART</h1> {/* Заголовок сторінки */}

      <div className="cart-content">
        {/* Секція таблиці товарів у кошику */}
        <div className="cart-items">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Colour</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="product-info">
                      {/* Додаємо посилання на сторінку продукту */}
                      <Link to={`/product/${item.id}`}>
                        <img src={item.image} alt={item.name} />
                      </Link>
                      <div>
                        <Link to={`/product/${item.id}`}>
                          <p>{item.name}</p>
                        </Link>
                        <p className="product-code">Code: {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>{item.color}</td>
                  <td>{item.size}</td>
                  <td>
                    <div className="quantity-controls">
                      <button onClick={() => addToCart({ ...item, quantity: -1 })}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => addToCart({ ...item, quantity: 1 })}>+</button>
                    </div>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Посилання для повернення до каталогу */}
          <Link to="/catalog" className="continue-shopping">→ CONTINUE SHOPPING</Link>
        </div>

        {/* Секція підсумку кошика */}
        <div className="cart-summary">
          <div className="summary-details">
            <p>Products price: <span>${totalProductsPrice.toFixed(2)}</span></p>
            <p>Shipping: <span>calculated at checkout</span></p>
            <p>Tax: <span>included</span></p>
            <p className="total-price">Total price: <span>${discountedPrice.toFixed(2)}</span></p>
          </div>
          <button className="checkout-button">→ CHECKOUT</button>

          {/* Поле для введення промокоду */}
          <div className="promo-code">
            <input
              type="text"
              placeholder="Add code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={handleApplyPromoCode}>→ APPLY</button>
          </div>
        </div>
      </div>

      {/* Кнопка для відкриття Help Desk */}
      <button className="help-desk-button" onClick={toggleHelpDesk}>HELP DESK</button>

      {/* Компонент Help Desk */}
      {isHelpDeskOpen && <HelpDesk onClose={toggleHelpDesk} />}

      {/* Рекомендації для покупців */}
      <div className="recommendations">
        <h2>YOU MIGHT ALSO LIKE</h2>
        <div className="recommendation-items">
          {/* Статичні дані для демонстрації */}
          <div className="recommendation-item">
            <img src="/images/recommendation1.png" alt="Recommendation 1" />
            <p>Fleur Noir Elegance</p>
            <p>$200.00</p>
          </div>
          <div className="recommendation-item">
            <img src="/images/recommendation2.png" alt="Recommendation 2" />
            <p>Delicate Bloom Charm Set</p>
            <p>$195.00</p>
          </div>
          <div className="recommendation-item">
            <img src="/images/recommendation3.png" alt="Recommendation 3" />
            <p>Ethereal Bloom Lingerie Set</p>
            <p>$310.00</p>
          </div>
          <div className="recommendation-item">
            <img src="/images/recommendation4.png" alt="Recommendation 4" />
            <p>Aurora Silk Harmony Set</p>
            <p>$270.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
