const express = require('express');
const router = express.Router();
const menusController = require('../controllers/menus');
const { verifyToken } = require('../utils/check_auth');

router.post('/', verifyToken, menusController.createMenu);
router.get('/', menusController.getAllMenus);
router.get('/:id', menusController.getMenuById);
router.put('/:id', verifyToken, menusController.updateMenu);
router.delete('/:id', verifyToken, menusController.deleteMenu);

module.exports = router;
