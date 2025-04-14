const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');
const { verifyToken, check_authorization } = require('../utils/check_auth');

router.post('/order', async (req, res) => {
  const { userId, shippingAddress } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const totalAmount = orderItems.reduce((total, item) => total + item.quantity * item.price, 0);

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    await order.save();
    await Cart.findOneAndDelete({ user: userId }); // Xóa giỏ hàng
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});