import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // Використання Axios Instance для API-запитів
import './ForgotPassword.scss'; // Стилі для сторінки

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState(''); // Стан для email
  const [message, setMessage] = useState<string | null>(null); // Повідомлення про успіх
  const [error, setError] = useState<string | null>(null); // Повідомлення про помилку
  const [isSubmitting, setIsSubmitting] = useState(false); // Стан кнопки (Loading)

  // Функція для відправки запиту на скидання пароля
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'A reset link has been sent to your email.');
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>Forgot Password?</h2>
        <p>Enter your email address, and we will send you a reset link.</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Відображення помилок або повідомлень про успіх */}
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          
          {/* Кнопка з завантаженням */}
          <button className="reset-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Посилання для повернення до логіну */}
        <p className="back-to-login">
          Remember your password? <Link to="/sign-in">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
