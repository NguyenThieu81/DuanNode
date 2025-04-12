const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { verifyToken } = require('../utils/check_auth');

router.post('/', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Không có file nào được upload' });
  }
  res.json({
    success: true,
    message: 'Upload thành công',
    file: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

module.exports = router;
