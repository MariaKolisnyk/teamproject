require('dotenv').config(); // Використання змінних середовища
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Підключення до PostgreSQL

const app = express();
const PORT = process.env.PORT || 8080;

// Налаштування CORS (щоб можна було робити запити з фронтенду)
app.use(cors());
app.use(express.json()); // Middleware для JSON

// Підключення до бази даних PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER, // Користувач бази даних
  host: process.env.DB_HOST, // Хост бази даних
  database: process.env.DB_NAME, // Назва бази даних
  password: process.env.DB_PASSWORD, // Пароль
  port: process.env.DB_PORT, // Порт бази даних
});

// 🛒 **1️⃣ Отримання всіх продуктів**
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔍 **2️⃣ Отримання продукту за ID**
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🏷 **3️⃣ Отримання продуктів за категорією**
app.get('/category/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE category_id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 💰 **4️⃣ Отримання продуктів зі знижками**
app.get('/products/on-sales', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE discount > 0');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sale products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔎 **5️⃣ Пошук продуктів**
app.get('/products/search', async (req, res) => {
  try {
    const { query } = req.query;
    const result = await pool.query(
      'SELECT * FROM products WHERE LOWER(name) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1)',
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🛒 **6️⃣ Кошик (отримання товарів у кошику)**
app.get('/cart', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cart');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ➕ **7️⃣ Додавання продукту в кошик**
app.post('/cart/add', async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const result = await pool.query(
      'INSERT INTO cart (product_id, quantity) VALUES ($1, $2) RETURNING *',
      [product_id, quantity]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🚀 **Запуск сервера**
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
