import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Homepage from './pages/Homepage';
import CatalogPage from './pages/CatalogPage';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import CheckoutPage from './pages/CheckoutPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import CartPage from './pages/CartPage';
import ForgotPassword from './pages/ForgotPassword';
import { FavoritesProvider } from './store/FavoritesContext';
import { CartProvider } from './store/CartContext';

// 🔹 Визначення всіх маршрутів в масиві
const routes = [
  { path: '/', component: <Homepage /> },
  { path: '/sign-in', component: <SignIn /> },
  { path: '/sign-up', component: <SignUp /> },
  { path: '/forgot-password', component: <ForgotPassword /> },
  { path: '/search', component: <Search /> },
  { path: '/profile', component: <Profile /> },
  { path: '/favorites', component: <Favorites /> },
  { path: '/cart', component: <CartPage /> },
  { path: '/catalog', component: <CatalogPage /> },
  { path: '/checkout', component: <CheckoutPage /> },
  { path: '*', component: <NotFound /> }, // ❗️404 сторінка
];

const App: React.FC = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔹 API URL:', process.env.REACT_APP_API_URL || '⚠️ NOT DEFINED');
  }

  return (
    <Router basename={process.env.PUBLIC_URL?.trim() ? process.env.PUBLIC_URL : '/'}>
      <FavoritesProvider>
        <CartProvider>
          <Routes>
            {routes.map(({ path, component }) => (
              <Route key={path} path={path} element={<Layout>{component}</Layout>} />
            ))}
          </Routes>
        </CartProvider>
      </FavoritesProvider>
    </Router>
  );
};

export default App;
