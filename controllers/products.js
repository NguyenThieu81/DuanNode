const productModel = require('../schemas/product');

module.exports = {
  async createProduct(data) {
    try {
      const product = new productModel(data);
      const saved = await product.save();
      return {
        success: true,
        message: 'Sản phẩm đã được tạo thành công',
        data: saved
      };
    } catch (error) {
      return {
        success: false,
        message: 'Lỗi khi tạo sản phẩm',
        error: error.message
      };
    }
  },

  async getAllProducts(req, res) {
    try {
      const host = req.get('host');
      const products = await productModel.find().populate('category');
      
      // Đảm bảo đường dẫn ảnh
      const formatted = products.map(p => ({
        ...p.toObject(),
        imageUrl: p.image ? `http://${host}/uploads/${p.image}` : null // Trả về URL đầy đủ
      }));
      res.json({ success: true, data: formatted });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
    }
  },

  async getProductById(req, res) {
    try {
      const id = req.params.id;
      const product = await productModel.findById(id).populate('category');
      if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });

      const host = req.get('host');
      const formatted = {
        ...product.toObject(),
        imageUrl: product.image ? `http://${host}/uploads/${product.image}` : null // Trả về URL ảnh đầy đủ
      };

      res.json({ success: true, data: formatted });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi lấy sản phẩm', error: error.message });
    }
  },

  async updateProduct(id, updateData) {
    try {
      const updated = await productModel.findByIdAndUpdate(id, updateData, { new: true });
      return { success: true, message: 'Cập nhật thành công', data: updated };
    } catch (error) {
      return { success: false, message: 'Lỗi khi cập nhật sản phẩm', error: error.message };
    }
  },

  async deleteProduct(id) {
    try {
      const deleted = await productModel.findByIdAndDelete(id);
      if (!deleted) {
        return { success: false, message: 'Sản phẩm không tồn tại' };
      }
      return { success: true, message: 'Đã xóa sản phẩm', data: deleted };
    } catch (error) {
      return { success: false, message: 'Lỗi khi xóa sản phẩm', error: error.message };
    }
  }
};
