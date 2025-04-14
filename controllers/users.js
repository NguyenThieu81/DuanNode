// File: controllers/users.js
const userModel = require('../schemas/user');
const roleModel = require('../schemas/role');
const bcrypt = require('bcrypt');

module.exports = {
  async register(username, password, email, roleName = 'user') {
    const role = await roleModel.findOne({ name: roleName });
    if (!role) throw new Error('Role không tồn tại');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username,
      password: hashedPassword,
      email,
      role: role._id,
    });

    return await newUser.save();
  },

  async login(username, password) {
    const user = await userModel.findOne({ username });
    if (!user) throw new Error('Tài khoản không tồn tại');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Sai mật khẩu');

    return user;
  },

  async getMe(userId) {
    return await userModel.findById(userId).select('-password').populate('role');
  },

  async getAllUsers(req, res) {
    try {
      const host = req.get('host');
      const users = await userModel.find().select('-password').populate('role');
      // Thêm domain vào URL của avatar
      const formattedUsers = users.map(user => ({
        ...user.toObject(),
        avatarUrl: user.avatar ? `http://${host}${user.avatar}` : null
    }));
    res.json({ success: true, data: formattedUsers });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getUserById(req, res) {
    try {
      const host = req.get('host');
      const user = await userModel.findById(req.params.id).select('-password').populate('role');
      if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
     // Thêm domain vào URL của avatar
     const formattedUsers = {
      ...user.toObject(),
      avatarUrl: user.avatar ? `http://${host}${user.avatar}` : null
  };
  res.json({ success: true, data: formattedUsers });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async createUser(req, res) {
    try {
        const { username, password, email, role } = req.body;

        if (!username || !password || !email || !role) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
        }

        const roleDoc = await roleModel.findById(role);
        if (!roleDoc) {
            return res.status(400).json({ success: false, message: 'Role không hợp lệ' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            password: hashedPassword,
            email,
            avatar: req.file ? `/uploads/${req.file.filename}` : null, // Lưu đường dẫn tương đối
            role,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ success: true, message: 'Tạo user thành công', data: savedUser });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
},

async updateUser(req, res) {
  try {
      const { username, email, role, password } = req.body;

      const updateData = {
          username,
          email,
          role,
      };

      if (req.file) {
          updateData.avatar = `/uploads/${req.file.filename}`; // Lưu đường dẫn tương đối
      }

      if (password) {
          updateData.password = await bcrypt.hash(password, 10);
      }

      const updated = await userModel.findByIdAndUpdate(req.params.id, updateData, {
          new: true,
      }).select('-password');

      if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });

      res.json({ success: true, message: 'Cập nhật thành công', data: updated });
  } catch (err) {
      res.status(400).json({ success: false, message: err.message });
  }
},
  async deleteUser(req, res) {
    try {
      const deleted = await userModel.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Không tìm thấy user để xóa' });

      res.json({ success: true, message: 'Xóa thành công' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  async changePassword(user, oldPassword, newPassword) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Mật khẩu cũ không đúng");
    user.password = await bcrypt.hash(newPassword, 10);
    return await user.save();
  }
};
