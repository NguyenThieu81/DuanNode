const categoryModel = require('../schemas/category');

module.exports = {
  async getAllCategories() {
    return await categoryModel.find();
  },

  async getCategoryById(id) {
    return await categoryModel.findById(id);
  },

  async createCategory(data) {
    const category = new categoryModel(data);
    return await category.save();
  },

  async updateCategory(id, data) {
    return await categoryModel.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteCategory(id) {
    return await categoryModel.findByIdAndDelete(id);
  }
};
