import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Навігація між сторінками
import HelpDesk from './HelpDesk';
import ArrowIcon from '../components/ArrowIcon';
import { getNewCollection, getProductsOnSale } from '../services/ProductService';
import axiosInstance from '../utils/axiosInstance';
import { useCart } from '../store/CartContext';
import { useFavorites } from '../store/FavoritesContext';
import './Homepage.scss';

// 🛠 Основний URL для отримання зображень з бекенду
const BASE_URL = 'https://lingerie-shop.onrender.com';

interface Product {
  id: number;
  title: string;
  price: string; // API повертає `price` як string
  available: boolean;
  images: { id: number; image: string; is_main: boolean }[];
}

// 🛠 Дані про бренди (локальний масив)
const brands = [
  { id: 1, name: 'Brand 1', imageUrl: '/images/brand1.png' },
  { id: 2, name: 'Brand 2', imageUrl: '/images/brand2.png' },
  { id: 3, name: 'Brand 3', imageUrl: '/images/brand3.png' },
  { id: 4, name: 'Brand 4', imageUrl: '/images/brand4.png' },
];

const Homepage: React.FC = () => {
  // 🛠 Стейт для роботи з UI
  const [isHelpDeskOpen, setHelpDeskOpen] = useState(false);
  const [newCollectionProducts, setNewCollectionProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);

  const [currentBrandPage, setCurrentBrandPage] = useState(0); // Оголошення стейту для пагінації
  const brandsPerPage = 4; // Кількість брендів на одній сторінці

  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  // Завантаження продуктів на розпродаж
  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const response = await axiosInstance.get('/products/on-sales/');
        setSaleProducts(response.data);
      } catch (err) {
        console.error('Не вдалося завантажити товари на розпродажі');
      }
    };

    fetchSaleProducts();
  }, []);

  // Завантаження бестселерів
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axiosInstance.get('/products/top-sales/');
        setBestSellers(response.data);
      } catch (err) {
        console.error('Не вдалося завантажити бестселери');
      }
    };

    fetchBestSellers();
  }, []);

  // Завантаження інших продуктів (нова колекція, розпродаж)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newCollection, sale] = await Promise.all([
          getNewCollection(),
          getProductsOnSale(),
        ]);

        setNewCollectionProducts(newCollection?.data || []);
        setSaleProducts(sale?.data || []);
      } catch (err) {
        console.error('❌ Помилка отримання даних:', err);
      }
    };

    fetchData();
  }, []);

  // Пагінація брендів (обробка кнопок ліворуч/праворуч)
  const handleBrandPagination = (direction: 'next' | 'prev') => {
    setCurrentBrandPage((prevPage) =>
      direction === 'next'
        ? Math.min(prevPage + 1, Math.ceil(brands.length / brandsPerPage) - 1)
        : Math.max(prevPage - 1, 0)
    );
  };


  return (
    <div className="homepage">
      {/* 🔹 Банер */}
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
        <button className="help-desk-button" onClick={() => setHelpDeskOpen((prev) => !prev)}>
          HELP DESK
        </button>
      </section>

      {isHelpDeskOpen && <HelpDesk onClose={() => setHelpDeskOpen(false)} />}

      {/* 🔹 Нова колекція */}
      <section className="collection-section">
        <h2 className="section-title">New Collection</h2>
        <div className="product-grid">
          {newCollectionProducts?.map((product) => {
            const mainImage = product.images.find((img) => img.is_main)?.image || product.images[0]?.image || '/images/placeholder.png';
            const formattedPrice = parseFloat(product.price).toFixed(2); // Перетворюємо рядок в число
            return (
              <div key={product.id} className="product-card">
                <img src={mainImage} alt={product.title} />
                <p>{product.title}</p>
                <p>${formattedPrice}</p>
              </div>
            );
          })}
        </div>
      </section>

       {/* 🔹 Бестселери */}
       <section className="best-sellers-section">
        <h2 className="section-title">Best Sellers</h2>
        <div className="product-grid">
          {bestSellers?.map((product) => {
            const mainImage = product.images.find((img) => img.is_main)?.image || product.images[0]?.image || '/images/placeholder.png';
            const formattedPrice = parseFloat(product.price).toFixed(2); // Перетворюємо рядок в число

            return (
              <div key={product.id} className="product-card">
                <img src={`${BASE_URL}${mainImage}`} alt={product.title} />
                <p>{product.title}</p>
                <p>${formattedPrice}</p>
                <div className="product-actions">
                  <button
                    className={`favorite-button ${favorites.some((fav) => fav.id === product.id) ? 'favorited' : ''}`}
                    onClick={() =>
                      favorites.some((fav) => fav.id === product.id)
                        ? removeFromFavorites(product.id)
                        : addToFavorites({
                            id: product.id,
                            name: product.title,
                            price: parseFloat(product.price),
                            image: `${BASE_URL}${mainImage}`,
                          })
                    }
                  >
                    ❤
                  </button>

                  <button
                    className="add-to-cart-button"
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.title,
                        price: parseFloat(product.price),
                        image: `${BASE_URL}${mainImage}`,
                        quantity: 1,
                      })
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* 🔹 Бренди */}
      <section className="brands-banner">
        <h2 className="section-title">Our Brands</h2>
        <div className="brands-carousel">
          <button className="carousel-arrow left-arrow" onClick={() => handleBrandPagination('prev')} disabled={currentBrandPage === 0}>
            ←
          </button>
          <div className="brands-container">
            {brands.slice(currentBrandPage * 4, currentBrandPage * 4 + 4).map((brand) => (
              <div key={brand.id} className="brand-logo">
                <img src={brand.imageUrl} alt={brand.name} />
                <p>{brand.name}</p>
              </div>
            ))}
          </div>
          <button className="carousel-arrow right-arrow" onClick={() => handleBrandPagination('next')} disabled={currentBrandPage + 1 >= Math.ceil(brands.length / 4)}>
            →
          </button>
        </div>
      </section>
      {/* 🔹 Розпродаж */}
      <section className="sale-section">
  <h2 className="section-title">Sale</h2>
  <div className="product-grid">
    {/* Завжди відображаємо продукти з розпродажу */}
    {saleProducts.map((product) => {
      // Якщо немає головного зображення, використовуємо fallback
      const mainImage = product.images.find((img) => img.is_main)?.image || '/images/placeholder.png';
      const formattedPrice = parseFloat(product.price).toFixed(2); // Перетворюємо рядок в число

      return (
        <div key={product.id} className="product-card">
          <img src={`${BASE_URL}${mainImage}`} alt={product.title} />
          <p>{product.title}</p>
          <p>${formattedPrice}</p>

          <div className="product-actions">
            {/* Додавання до обраного */}
            <button
              className={`favorite-button ${favorites.some((fav) => fav.id === product.id) ? 'favorited' : ''}`}
              onClick={() =>
                favorites.some((fav) => fav.id === product.id)
                  ? removeFromFavorites(product.id)
                  : addToFavorites({
                      id: product.id,
                      name: product.title,
                      price: parseFloat(product.price),
                      image: `${BASE_URL}${mainImage}`,
                    })
              }
            >
              ❤
            </button>

            {/* Додавання до кошика */}
            <button
              className="add-to-cart-button"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.title,
                  price: parseFloat(product.price),
                  image: `${BASE_URL}${mainImage}`,
                  quantity: 1,
                })
              }
            >
              Add to Cart
            </button>
          </div>
        </div>
      );
    })}
  </div>
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
            <img src="/images/ins1.jpg" alt=" " />
            <img src="/images/ins2.jpg" alt=" " />
            <img src="/images/ins3.jpg" alt=" " />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
