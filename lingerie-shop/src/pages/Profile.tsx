import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance'; // Використання глобального Axios
import { useNavigate } from 'react-router-dom';
import './Profile.scss'; // Підключення стилів

const Profile: React.FC = () => {
  const navigate = useNavigate();

  // 📌 Стан для збереження даних користувача
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [newPassword, setNewPassword] = useState(''); // Стан нового пароля
  const [message, setMessage] = useState<string | null>(null); // Повідомлення про успіх
  const [error, setError] = useState<string | null>(null); // Повідомлення про помилку
  const [loading, setLoading] = useState(true); // Стан завантаження профілю

  // 📌 Завантаження даних профілю
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile/');
        setUser(response.data); // Заповнюємо поля профілю
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // 📌 Оновлення профілю
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put('/auth/profile/', user);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  // 📌 Оновлення пароля
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/auth/change-password', { newPassword });
      setMessage('Password changed successfully!');
      setNewPassword('');
    } catch (err) {
      setError('Failed to change password.');
    }
  };

  // 📌 Вихід із системи
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('authToken'); // Видалення токена
      navigate('/sign-in'); // Перенаправлення на сторінку входу
    } catch (err) {
      setError('Failed to logout.');
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-page">
      <h1>User Profile</h1>

      {message && <p className="success-message">{message}</p>}

      {/* 📌 Форма редагування профілю */}
      <form onSubmit={handleProfileUpdate}>
        <label>First Name:</label>
        <input
          type="text"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        />

        <label>Last Name:</label>
        <input
          type="text"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        />

        <label>Email:</label>
        <input type="email" value={user.email} disabled />

        <label>Phone:</label>
        <input
          type="text"
          value={user.phone}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
        />

        <button type="submit">Update Profile</button>
      </form>

      {/* 📌 Форма зміни пароля */}
      <form onSubmit={handlePasswordChange}>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit">Change Password</button>
      </form>

      {/* 📌 Кнопка виходу з системи */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
