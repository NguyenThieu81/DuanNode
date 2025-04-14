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
      const user = req.user; // Đảm bảo lấy user từ req.user sau khi đã xác thực
      if (!user) return res.status(404).json({ success: false, message: 'User không tồn tại' });
  
      // Lấy đường dẫn đầy đủ cho avatar (có thể là URL tuyệt đối)
      const avatarUrl = user.avatar ? `${process.env.BASE_URL}/uploads/${user.avatar}` : null;
  
      res.status(200).json({
        success: true,
        data: {
          username: user.username,
          avatar: avatarUrl,  // Trả về avatar đầy đủ
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
  },
  
};