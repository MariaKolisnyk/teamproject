import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // Використання глобального axios
import Footer from '../components/Footer';
import './SignUp.scss';

const SignUp: React.FC = () => {
  const navigate = useNavigate(); // Хук для редіректу

  // Стан форми реєстрації
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    agreeToTerms: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({}); // Помилки для полів форми
  const [showPassword, setShowPassword] = useState(false); // Видимість пароля

  // Обробка зміни полів форми
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Функція для перевірки правильності номера телефону
  const isValidPhoneNumber = (phone: string) => {
    return /^\+?\d{9,15}$/.test(phone); // Перевіряємо, чи відповідає номер формату
  };

  // Обробка надсилання форми
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Перевірка паролів перед відправкою
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    // Перевірка формату телефону перед відправкою
    if (!isValidPhoneNumber(formData.phone)) {
      setError('Phone number must contain 9 to 15 digits and can start with "+".');
      return;
    }

    // Перевірка згоди з політикою конфіденційності
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and privacy policy.');
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/register/', {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      });

      console.log('Registration successful:', response.data);
      setError(null);
      localStorage.setItem('authToken', response.data.token); // Збереження токена
      navigate('/'); // Перенаправлення на головну сторінку

    } catch (err: any) {
      console.error('Registration error:', err.response?.data);
      setError('Registration failed. Please check your inputs.');
      setFieldErrors(err.response?.data || {}); // Зберігаємо помилки для полів
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-container">
        <div className="sign-up-form">
          <h2>CREATE AN ACCOUNT</h2>
          <form onSubmit={handleSubmit}>
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            {fieldErrors.first_name && <p className="error-message">{fieldErrors.first_name[0]}</p>}

            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter your last name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            {fieldErrors.last_name && <p className="error-message">{fieldErrors.last_name[0]}</p>}

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && <p className="error-message">{fieldErrors.email[0]}</p>}

            <label>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {fieldErrors.phone && <p className="error-message">{fieldErrors.phone[0]}</p>}

            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="show-password-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            {fieldErrors.password && <p className="error-message">{fieldErrors.password[0]}</p>}

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm your password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
            {fieldErrors.confirm_password && <p className="error-message">{fieldErrors.confirm_password[0]}</p>}

            <div className="terms">
              <label>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                I agree to the <Link to="/privacy-policy">Privacy policy</Link> and{' '}
                <Link to="/terms-of-use">Terms of use</Link> of this site.
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button className="create-account-button" type="submit">
              CREATE AN ACCOUNT
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
