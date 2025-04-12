const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  order: { type: Number, default: 0 },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null }, // nếu có menu cha
});

module.exports = mongoose.model('Menu', menuSchema);
