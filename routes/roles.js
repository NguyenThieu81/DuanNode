const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles');

router.get('/', async (req, res) => {
  const roles = await rolesController.GetAllRoles();
  res.json(roles);
});

router.post('/', async (req, res) => {
  const role = await rolesController.CreateARole(req.body.name);
  res.json(role);
});

module.exports = router;
