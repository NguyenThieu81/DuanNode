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

  async getAllUsers() {
    return await userModel.find().select('-password');
  },

  async getUserById(id) {
    return await userModel.findById(id).select('-password');
  },

  async updateUser(id, updateData) {
    return await userModel.findByIdAndUpdate(id, updateData, { new: true });
  },

  async deleteUser(id) {
    return await userModel.findByIdAndDelete(id);
  },

  async changePassword(user, oldPassword, newPassword) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Mật khẩu cũ không đúng");
    user.password = await bcrypt.hash(newPassword, 10);
    return await user.save();
  }
};
