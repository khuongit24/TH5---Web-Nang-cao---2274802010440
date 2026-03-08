const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/th5_shop')
  .then(() => console.log('Đã kết nối tới MongoDB'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session for Cart
app.use(session({
  secret: process.env.SESSION_SECRET || 'super_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Global variable for view templates
app.use((req, res, next) => {
  res.locals.cartItemCount = req.session.cart ? req.session.cart.length : 0;
  next();
});

// Routes
const apiRoutes = require('./routes/api');
const indexRoutes = require('./routes/index');

app.use('/api', apiRoutes);
app.use('/', indexRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
