const menuModel = require('../schemas/menu');

module.exports = {
  async createMenu(req, res) {
    try {
      const data = req.body;
      const menu = new menuModel(data);
      const saved = await menu.save();
      res.status(201).json({ success: true, message: 'Đã tạo menu', data: saved });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi tạo menu', error: error.message });
    }
  },

  async getAllMenus(req, res) {
    try {
      const menus = await menuModel.find().sort({ order: 1 });
      res.json({ success: true, data: menus });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi lấy menu', error: error.message });
    }
  },

  async getMenuById(req, res) {
    try {
      const menu = await menuModel.findById(req.params.id);
      if (!menu) return res.status(404).json({ success: false, message: 'Không tìm thấy menu' });

      res.json({ success: true, data: menu });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi lấy chi tiết menu', error: error.message });
    }
  },

  async updateMenu(req, res) {
    try {
      const updated = await menuModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, message: 'Cập nhật thành công', data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi cập nhật', error: error.message });
    }
  },

  async deleteMenu(req, res) {
    try {
      const deleted = await menuModel.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Đã xóa menu', data: deleted });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi xóa menu', error: error.message });
    }
  }
};
