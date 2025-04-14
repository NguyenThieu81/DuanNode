const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');
const { verifyToken, check_authorization } = require('../utils/check_auth');

// Thêm sản phẩm vào giỏ hàng
router.post('/cart/add', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * product.price;
    }, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/cart/remove', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    cart.totalPrice = cart.items.reduce(async (total, item) => {
      const product = await Product.findById(item.product);
      return total + item.quantity * product.price;
    }, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});