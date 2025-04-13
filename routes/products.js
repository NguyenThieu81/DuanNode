const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');
const multer = require('multer');
const { verifyToken, check_authorization } = require('../utils/check_auth');

// Configuring multer for image uploads
const upload = multer({ dest: 'public/uploads/' });

/**
 * Get all products (accessible by everyone)
 */
router.get('/', productController.getAllProducts);

/**
 * Get product details by ID
 */
router.get('/:id', productController.getProductById);

/**
 * Add a new product - Admin only
 */
router.post(
  '/',
  verifyToken,
  check_authorization(['admin']),
  upload.single('image'),
  async (req, res) => {
    try {
      const data = { ...req.body, image: req.file?.filename };
      const result = await productController.createProduct(data);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Unknown error', error: error.message });
    }
  }
);

/**
 * Update a product by ID - Admin only
 */
router.put('/:id', verifyToken, check_authorization(['admin']), upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.filename;
    }
    const result = await productController.updateProduct(req.params.id, data);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Delete a product - Admin only
 */
router.delete('/:id', verifyToken, check_authorization(['admin']), async (req, res) => {
  try {
    const result = await productController.deleteProduct(req.params.id);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
