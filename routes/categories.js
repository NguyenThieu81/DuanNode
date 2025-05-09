const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');
const { verifyToken, check_authorization } = require('../utils/check_auth');

router.get('/', async (req, res) => {
  const categories = await categoriesController.getAllCategories();
  res.json(categories);
});

router.get('/:id', async (req, res) => {
  const category = await categoriesController.getCategoryById(req.params.id);
  res.json(category);
});

router.post('/',verifyToken,
  check_authorization(['admin']),
  async (req, res) => {
  const created = await categoriesController.createCategory(req.body);
  res.json(created);
});

router.put('/:id',verifyToken,
  check_authorization(['admin']),
  async (req, res) =>{
  const updated = await categoriesController.updateCategory(req.params.id, req.body);
  res.json(updated);
});

router.delete('/:id',verifyToken,
  check_authorization(['admin']),
  async (req, res) => {
  const deleted = await categoriesController.deleteCategory(req.params.id);
  res.json(deleted);
});

module.exports = router;
