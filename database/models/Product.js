const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '-' },
  category: { type: String, default: 'general' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);