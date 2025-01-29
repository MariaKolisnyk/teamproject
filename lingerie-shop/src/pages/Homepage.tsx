import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HelpDesk from './HelpDesk';
import ArrowIcon from '../components/ArrowIcon';
import {
  getNewCollection,
  getBestSellers,
  getTailoringProducts,
  getProductsOnSale, // Імпорт функції для продуктів зі знижками
} from '../services/ProductService';

import './Homepage.scss';

// Інтерфейс для продуктів
interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

// Масив брендів (статичний приклад)
const brands = [
  { id: 1, name: 'Brand 1', imageUrl: '/images/brand1.png' },
  { id: 2, name: 'Brand 2', imageUrl: '/images/brand2.png' },
  { id: 3, name: 'Brand 3', imageUrl: '/images/brand3.png' },
  { id: 4, name: 'Brand 4', imageUrl: '/images/brand4.png' },
];

const Homepage: React.FC = () => {
  const [isHelpDeskOpen, setHelpDeskOpen] = useState(false); // Відкриття Help Desk
  const [newCollectionProducts, setNewCollectionProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [tailoringProducts, setTailoringProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentBrandPage, setCurrentBrandPage] = useState(0);
  const brandsPerPage = 4;

  // Завантаження даних з API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newCollection, bestSellers, sale, tailoring] = await Promise.all([
          getNewCollection(), // Ендпоінт для нової колекції
          getBestSellers(), // Ендпоінт для бестселерів
          getProductsOnSale(), // Ендпоінт для продуктів зі знижками
          getTailoringProducts(), // Ендпоінт для індивідуального пошиття
        ]);
        setNewCollectionProducts(newCollection.data);
        setBestSellers(bestSellers.data);
        setSaleProducts(sale.data);
        setTailoringProducts(tailoring.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      }
    };
    fetchData();
  }, []);

  // Відображення брендів
  const displayedBrands = brands.slice(
    currentBrandPage * brandsPerPage,
    currentBrandPage * brandsPerPage + brandsPerPage
  );

  const handleBrandPagination = (direction: 'next' | 'prev') => {
    setCurrentBrandPage((prevPage) =>
      direction === 'next'
        ? Math.min(prevPage + 1, Math.ceil(brands.length / brandsPerPage) - 1)
        : Math.max(prevPage - 1, 0)
    );
  };

  const toggleHelpDesk = () => setHelpDeskOpen((prev) => !prev);
  return (
    <div className="homepage">
      {/* Секція банера */}
      <section className="banner-section">
        <div className="banner-content">
          <h1 className="banner-title">
            BREAK PATTERNS <span className="highlight">WITH US</span>
          </h1>
          <p className="banner-description">
            In our store, you can buy ready-made designer underwear or bring to life any of your sketches.
          </p>
          <Link to="/catalog" className="shop-now-button">
            <ArrowIcon color="#1F1F21" /> SHOP NOW
          </Link>
        </div>

        {/* Кнопка Help Desk */}
        <button className="help-desk-button" onClick={toggleHelpDesk}>
          HELP DESK
        </button>
      </section>

      {/* Відображення HelpDesk */}
      {isHelpDeskOpen && <HelpDesk onClose={toggleHelpDesk} />}
    
       
        
  
       {/* New Collection Section */}
      <section className="collection-section">
        <h2 className="section-title">New Collection</h2>
        <div className="product-grid">
          {newCollectionProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <button className="product-button">{product.name.toUpperCase()}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="best-sellers-section">
        <h2 className="section-title">Best Sellers</h2>
        <div className="product-grid">
          {bestSellers.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <div className="product-info">
                <p>{product.name}</p>
                <p>${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brands Section */}
      <section className="brands-banner">
        <h2 className="section-title">Our Brands</h2>
        <div className="brands-carousel">
          <button
            className="carousel-arrow left-arrow"
            onClick={() => handleBrandPagination('prev')}
            disabled={currentBrandPage === 0}
          >
            ←
          </button>
          <div className="brands-container">
            {displayedBrands.map((brand) => (
              <div key={brand.id} className="brand-logo">
                <img src={brand.imageUrl} alt={brand.name} />
                <p>{brand.name}</p>
              </div>
            ))}
          </div>
          <button
            className="carousel-arrow right-arrow"
            onClick={() => handleBrandPagination('next')}
            disabled={currentBrandPage + 1 >= Math.ceil(brands.length / brandsPerPage)}
          >
            →
          </button>
        </div>
      </section>

      {/* Sale Section */}
      <section className="sale-section">
        <h2 className="section-title">Sale</h2>
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="product-grid">
            {saleProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <p>{product.name}</p>
                  <p>${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Us Section */}
      <section className="about-us-section">
        <div className="about-us-container">
          <div className="advantages">
            <h2 className="section-title">Our Shop Advantages</h2>
            <div className="advantages-grid">
              <div className="advantage">
                <img src="/images/free-shipping.png" alt="Free Shipping" />
                <p>Free Shipping</p>
              </div>
              <div className="advantage">
                <img src="/images/secure-payment.png" alt="Secure Payment" />
                <p>Secure Payment</p>
              </div>
              <div className="advantage">
                <img src="/images/purchase-bonuses.png" alt="Purchase Bonuses" />
                <p>Purchase Bonuses</p>
              </div>
              <div className="advantage">
                <img src="/images/easy-return.png" alt="Easy Return" />
                <p>Easy Return</p>
              </div>
            </div>
          </div>

          <div className="about-us-text">
            <h2 className="section-title">Few Words About Us</h2>
            <p className="section-subtitle">
              We care about women and create a great service to make them feel comfortable
              in the right lingerie.
            </p>
            <button className="instagram-button">
              <span>Our Instagram</span>
              <ArrowIcon color="#AC643E" />
            </button>
            <div className="instagram-photos">
              <img src="/images/ins1.png" alt=" " />
              <img src="/images/ins2.png" alt=" " />
              <img src="/images/ins3.png" alt=" " />
            </div>
          </div>
        </div>
      </section>           
    </div>
  );
};

export default Homepage;