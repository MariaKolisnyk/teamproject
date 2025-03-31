import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Footer from '../components/Footer';
import './SignIn.scss';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/auth/login/', {
        email: formData.email,
        password: formData.password,
      });

      const token = response.data.access;
      if (formData.rememberMe) {
        localStorage.setItem('authToken', token);
      } else {
        sessionStorage.setItem('authToken', token);
      }

      setError(null);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="sign-in-page">
      <div className="sign-in-container">
        <div className="sign-in-form">
          <h2>SIGN IN</h2>
          <form onSubmit={handleSubmit}>
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
              <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</span>
            </div>
            <div className="options">
              <label>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit">SIGN IN</button>
          </form>
          <p>
            Don’t have an account? <Link to="/sign-up">Create an account</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
