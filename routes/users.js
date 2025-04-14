const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const multer = require('multer');
const { verifyToken, check_authorization } = require('../utils/check_auth');

const upload = multer({ dest: 'public/uploads/' });

// Lấy danh sách user
router.get('/', verifyToken, check_authorization(['admin']), userController.getAllUsers);

// Lấy user theo ID
router.get('/:id', verifyToken, check_authorization(['admin']), userController.getUserById);

// Thêm user mới
router.post(
  '/',
  verifyToken,
  check_authorization(['admin']),
  upload.single('avatar'),
  userController.createUser
);

// Cập nhật user
router.put(
  '/:id',
  verifyToken,
  check_authorization(['admin']),
  upload.single('avatar'),
  userController.updateUser
);

// Xóa user
router.delete('/:id', verifyToken, check_authorization(['admin']), userController.deleteUser);

module.exports = router;

