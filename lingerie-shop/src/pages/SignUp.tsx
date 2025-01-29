import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // Використання глобального axios
import Footer from '../components/Footer';
import './SignUp.scss';

const SignUp: React.FC = () => {
  const navigate = useNavigate(); // Хук для редіректу

  // Стан форми реєстрації
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // Стан для перемикання видимості пароля

  // Обробка зміни полів форми
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value, // Якщо чекбокс, використовуємо checked
    });
  };

  // Обробка надсилання форми
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Перевірка згоди з політикою конфіденційності
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and privacy policy.');
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/register', {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
      });

      console.log('Registration successful:', response.data);
      setError(null);
      localStorage.setItem('authToken', response.data.token); // Збереження токена
      navigate('/'); // Перенаправлення на головну сторінку

    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-container">
        <div className="sign-up-form">
          <h2>CREATE AN ACCOUNT</h2>
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Surname</label>
            <input
              type="text"
              name="surname"
              placeholder="Enter your surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
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
          <div className="or-section">or continue with</div>
          <div className="social-buttons">
            <button className="google">Google</button>
            <button className="apple">Apple</button>
            <button className="facebook">Facebook</button>
          </div>
          <p className="sign-in-link">
            Already have an account? <Link to="/sign-in">Sign in</Link>
          </p>
        </div>
        <div className="account-benefits">
          <h3>ACCOUNT BENEFITS</h3>
          <ul>
            <li>Get a bonus for the first online purchase for new members.</li>
            <li>Get cashback to your personal account for every order.</li>
            <li>Use a more convenient way to make and track the order.</li>
            <li>First to learn about interesting promotions.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
