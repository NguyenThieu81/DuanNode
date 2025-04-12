const userModel = require('../schemas/user');
const roleModel = require('../schemas/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

module.exports = {
  async register(req, res) {
    try {
      const { username, password, email, role = 'user' } = req.body;

      // Kiểm tra xem role có tồn tại không
      const roleDoc = await roleModel.findOne({ name: role });
      if (!roleDoc) throw new Error(`Role '${role}' không tồn tại`);

      // Kiểm tra trùng username/email
      const existingUser = await userModel.findOne({ username });
      if (existingUser) throw new Error('Username đã tồn tại');

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo user mới
      const newUser = new userModel({
        username,
        password: hashedPassword,
        email,
        role: roleDoc._id,
      });

      const savedUser = await newUser.save();
      res.json({ success: true, message: 'Đăng ký thành công', data: savedUser });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await userModel.findOne({ username });
      if (!user) throw new Error('Tài khoản không tồn tại');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error('Sai mật khẩu');

      const token = jwt.sign({ id: user._id }, constants.SECRET_KEY, { expiresIn: '2h' });

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async getMe(req, res) {
    try {
      const user = await userModel.findById(req.user._id)
        .select('-password')
        .populate('role');
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
