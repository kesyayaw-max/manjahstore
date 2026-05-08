const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  productCode: { type: String, required: true },
  content: { type: String, required: true },
  sold: { type: Boolean, default: false },
  soldTo: { type: String, default: null },
  soldAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);