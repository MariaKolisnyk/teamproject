import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HelpDesk from '../pages/HelpDesk'; // Випадаюче меню довідкової служби
import { useCart } from '../store/CartContext'; // Контекст для роботи з кошиком
import axiosInstance from '../utils/axiosInstance'; // Інстанс для запитів на бекенд
import './CartPage.scss'; // Стилі для сторінки кошика

const CartPage: React.FC = () => {
  const { cart, removeFromCart, addToCart, fetchCart } = useCart(); // Отримання функцій та стану кошика
  const [promoCode, setPromoCode] = useState(''); // Поле для промокоду
  const [discount, setDiscount] = useState(0); // Значення знижки
  const [isHelpDeskOpen, setHelpDeskOpen] = useState(false); // Видимість вікна Help Desk

  // Завантаження кошика при рендері сторінки
  useEffect(() => {
    fetchCart();
  }, []);

  // Функція для застосування промокоду
  const handleApplyPromoCode = async () => {
    try {
      const response = await axiosInstance.post('/api/v1/cart/apply-promo', { promoCode });
      setDiscount(response.data.discount); // Отримання знижки від бекенду
    } catch (error) {
      console.error('Invalid promo code:', error);
      alert('Invalid promo code');
      setDiscount(0);
    }
  };

  // Обчислення загальної вартості товарів у кошику
  const totalProductsPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedPrice = totalProductsPrice - (totalProductsPrice * discount) / 100;

  // Функція перемикання Help Desk
  const toggleHelpDesk = () => {
    setHelpDeskOpen((prev) => !prev);
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">CART</h1>

      <div className="cart-content">
        {/* Секція товарів у кошику */}
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

          {/* Поле введення промокоду */}
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

      {/* Кнопка Help Desk */}
      <button className="help-desk-button" onClick={toggleHelpDesk}>HELP DESK</button>
      {isHelpDeskOpen && <HelpDesk onClose={toggleHelpDesk} />}

      {/* Рекомендації для покупців */}
      <div className="recommendations">
        <h2>YOU MIGHT ALSO LIKE</h2>
        <div className="recommendation-items">
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
