const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');
const multer = require('multer');
const { verifyToken, check_authorization } = require('../utils/check_auth');

// Cấu hình multer để upload ảnh vào thư mục public/uploads/
const upload = multer({ dest: 'public/uploads/' });

/**
 * Lấy danh sách tất cả sản phẩm (ai cũng được truy cập)
 */
router.get('/', productController.getAllProducts);

/**
 * Lấy thông tin chi tiết sản phẩm theo ID
 */
router.get('/:id', productController.getProductById);

/**
 * Thêm sản phẩm mới - chỉ admin
 */
router.post(
  '/',
  verifyToken,
  check_authorization(['admin']),
  upload.single('image'),
  async (req, res) => {
    const data = { ...req.body, image: req.file?.filename };
    const created = await productController.createProduct(data);
    res.json(created);
  }
);

/**
 * Cập nhật sản phẩm theo ID - chỉ admin
 */
router.put(
  '/:id',
  verifyToken,
  check_authorization(['admin']),
  upload.single('image'),
  async (req, res) => {
    const data = { ...req.body, image: req.file?.filename };
    const updated = await productController.updateProduct(req.params.id, data);
    res.json(updated);
  }
);

/**
 * Xóa sản phẩm - chỉ admin
 */
router.delete(
  '/:id',
  verifyToken,
  check_authorization(['admin']),
  async (req, res) => {
    const deleted = await productController.deleteProduct(req.params.id);
    res.json(deleted);
  }
);

module.exports = router;