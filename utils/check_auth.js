const jwt = require('jsonwebtoken');
const constants = require('./constants');
const userSchema = require('../schemas/user');

// Middleware kiểm tra xác thực
function verifyToken(req, res, next) {
  // Lấy token từ Header hoặc cookie
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies.token;

  if (!token) return res.status(401).json({ error: 'Không có token' });

  try {
    const decoded = jwt.verify(token, constants.SECRET_KEY);
    userSchema.findById(decoded.id).populate('role')
      .then(user => {
        if (!user) return res.status(401).json({ error: 'Người dùng không tồn tại' });
        req.user = user;
        next();
      })
      .catch(() => res.status(401).json({ error: 'Lỗi xác thực người dùng' }));
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
}

// Middleware kiểm tra phân quyền theo tên role
function check_authorization(roles = []) {
  return function (req, res, next) {
    const roleName = req.user?.role?.name;
    if (!roleName || !roles.includes(roleName)) {
      return res.status(403).json({ error: 'Không đủ quyền truy cập' });
    }
    next();
  };
}

// Tạo token từ user
function generateToken(user) {
  return jwt.sign({ id: user._id }, constants.SECRET_KEY, { expiresIn: '1h' });
}

module.exports = {
  verifyToken,
  check_authorization,
  generateToken
};
