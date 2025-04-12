const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../schemas/user');
const roleModel = require('../schemas/role');
const { verifyToken, check_authorization } = require('../utils/check_auth');

router.post('/', [verifyToken, check_authorization(['admin'])], async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Kiểm tra role tồn tại
    const roleDoc = await roleModel.findById(role);
    if (!roleDoc) {
      return res.status(400).json({ success: false, message: 'Role không hợp lệ' });
    }

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = await userModel.create({
      username,
      password: hashedPassword,
      email,
      role
    });

    res.status(201).json({ success: true, message: 'Tạo user thành công', data: newUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;