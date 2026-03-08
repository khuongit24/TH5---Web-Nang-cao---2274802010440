const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Trang chủ - Danh sách sản phẩm
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('index', { products: products, pageTitle: 'Danh sách sản phẩm' });
  } catch (err) {
    res.status(500).send('Lỗi máy chủ: ' + err.message);
  }
});

// Trang chi tiết sản phẩm
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Không tìm thấy sản phẩm');
    res.render('product', { product: product, pageTitle: product.name });
  } catch (err) {
    res.status(500).send('Lỗi máy chủ: ' + err.message);
  }
});

// Trang giỏ hàng
router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  // Gộp các sản phẩm giống nhau
  const cartItems = [];
  let total = 0;
  
  cart.forEach(item => {
    const existingItem = cartItems.find(i => i._id === item._id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }
    total += item.price;
  });

  res.render('cart', { cartItems: cartItems, total: total, pageTitle: 'Giỏ hàng của bạn' });
});

// Thêm vào giỏ hàng
router.post('/cart/add/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Không tìm thấy sản phẩm');
    
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    // Lưu thông tin cơ bản vào session
    req.session.cart.push({
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl
    });
    
    res.redirect('/cart');
  } catch (err) {
    res.status(500).send('Lỗi máy chủ: ' + err.message);
  }
});

// Xóa giỏ hàng
router.post('/cart/clear', (req, res) => {
  req.session.cart = [];
  res.redirect('/cart');
});

module.exports = router;
