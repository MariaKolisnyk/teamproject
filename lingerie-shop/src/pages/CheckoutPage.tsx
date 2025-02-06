import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useCart } from '../store/CartContext';
import './CheckoutPage.scss';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [promoCode, setPromoCode] = useState('');
  const [orderSummary, setOrderSummary] = useState({
    itemsWorth: 0,
    deliveryCost: 35.0,
    promoDiscount: 0.0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🚀 Отримуємо профіль користувача при завантаженні сторінки
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/user/profile');
        const { firstName, lastName, phone, email } = response.data;
        setContactInfo({ firstName, lastName, phone, email });
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // 🚀 Розрахунок загальної суми замовлення
  useEffect(() => {
    const itemsWorth = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setOrderSummary((prev) => ({ ...prev, itemsWorth }));
  }, [cart]);

  // 📌 Перехід між етапами
  const handleNextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePreviousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // 🎟️ Застосування промокоду
  const applyPromoCode = async () => {
    try {
      const response = await axiosInstance.post('/order/apply-promo', { code: promoCode });
      setOrderSummary((prev) => ({
        ...prev,
        promoDiscount: response.data.discountAmount,
      }));
    } catch (error) {
      alert('Invalid promo code.');
      setOrderSummary((prev) => ({ ...prev, promoDiscount: 0 }));
    }
  };

  // ✅ Відправлення замовлення
  const handleSubmitOrder = async () => {
    if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.phone || !contactInfo.email) {
      alert('Please fill in all contact information.');
      return;
    }

    try {
      const orderData = {
        contactInfo,
        deliveryMethod,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        promoCode,
      };

      await axiosInstance.post('/order/create', orderData);
      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Failed to submit order:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  if (loading) return <p>Loading checkout...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* Етапи оформлення */}
      <div className="checkout-steps">
        <span className={step === 1 ? 'active' : ''}>1. Contact Information</span>
        <span className={step === 2 ? 'active' : ''}>2. Delivery Method</span>
        <span className={step === 3 ? 'active' : ''}>3. Payment Method</span>
      </div>

      {/* Форма контактної інформації */}
      {step === 1 && (
        <section className="contact-information">
          <h2>1. Contact Information</h2>
          <form>
            {Object.keys(contactInfo).map((key) => (
              <div key={key}>
                <label>{key.replace(/([A-Z])/g, ' $1').trim()} *</label>
                <input
                  type="text"
                  value={contactInfo[key as keyof typeof contactInfo]}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, [key]: e.target.value })
                  }
                />
              </div>
            ))}
          </form>
        </section>
      )}

      {/* Метод доставки */}
      {step === 2 && (
        <section className="delivery-method">
          <h2>2. Delivery Method</h2>
          {['post_office', 'courier', 'pickup', 'international'].map((method) => (
            <label key={method}>
              <input
                type="radio"
                name="delivery"
                value={method}
                checked={deliveryMethod === method}
                onChange={(e) => setDeliveryMethod(e.target.value)}
              />
              {method.replace('_', ' ').toUpperCase()}
            </label>
          ))}
        </section>
      )}

      {/* Метод оплати */}
      {step === 3 && (
        <section className="payment-method">
          <h2>3. Payment Method</h2>
          {['apple_pay', 'google_pay', 'credit_card', 'cash'].map((method) => (
            <label key={method}>
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              {method.replace('_', ' ').toUpperCase()}
            </label>
          ))}
        </section>
      )}

      {/* Підсумок замовлення */}
      <aside className="order-summary">
        <h3>Order Summary</h3>
        <p>Items: ${orderSummary.itemsWorth.toFixed(2)}</p>
        <p>Delivery: ${orderSummary.deliveryCost.toFixed(2)}</p>
        <p>Discount: -${orderSummary.promoDiscount.toFixed(2)}</p>
        <p>
          <strong>Total:</strong> $
          {(orderSummary.itemsWorth + orderSummary.deliveryCost - orderSummary.promoDiscount).toFixed(2)}
        </p>
        <input
          type="text"
          value={promoCode}
          placeholder="Promo Code"
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button onClick={applyPromoCode}>Apply Promo Code</button>
      </aside>

      {/* Кнопки переходу */}
      <div className="checkout-controls">
        <button disabled={step === 1} onClick={handlePreviousStep}>Back</button>
        <button onClick={step === 3 ? handleSubmitOrder : handleNextStep}>
          {step === 3 ? 'Submit Order' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
