import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MiniCart from './components/MiniCart';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMiniCartOpen, setMiniCartOpen] = useState(false); // Стан MiniCart

  // Відкриття/закриття MiniCart
  const toggleMiniCart = () => {
    setMiniCartOpen((prev) => !prev);
  };

  return (
    <>
      <Header toggleMiniCart={toggleMiniCart} /> {/* Передаємо `toggleMiniCart` */}

      {/* MiniCart відкривається поверх сторінки */}
      {isMiniCartOpen && <MiniCart onClose={toggleMiniCart} />}

      {/* Основний контент */}
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</main>

      <Footer />
    </>
  );
};

export default Layout;
