const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  invoiceId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  productCode: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'expired', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);