const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  invoiceId: String,
  buyerName: String,
  buyerDiscord: String,

  productCode: String,
  productName: String,
  qty: {
    type: Number,
    default: 1
  },

  total: Number,

  paymentMethod: String,
  paymentProof: String,

  status: {
    type: String,
    default: 'pending'
    // pending | paid | rejected | delivered
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);