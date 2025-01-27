import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import './MiniCart.scss';

interface MiniCartProps {
  onClose: () => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ onClose }) => {
  const { cart, removeFromCart } = useCart();
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mini-cart-overlay" onClick={onClose}>
      {/* Основний блок MiniCart */}
      <div className="mini-cart" onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закриття */}
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2 className="mini-cart-title">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="empty-message">Your cart is empty.</p>
        ) : (
          <>
            {/* Список товарів */}
            <ul className="cart-items">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            {/* Підсумок і кнопки дій */}
            <div className="mini-cart-summary">
              <p className="total-amount">
                Total: <span>${totalAmount.toFixed(2)}</span>
              </p>
              <div className="action-buttons">
                <Link to="/cart" className="view-cart-button" onClick={onClose}>
                  → VIEW SHOPPING CART
                </Link>
                <Link to="/checkout" className="checkout-button" onClick={onClose}>
                  → CHECKOUT
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MiniCart;
