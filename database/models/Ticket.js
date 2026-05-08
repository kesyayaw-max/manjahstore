const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  userId: { type: String, required: true },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  invoiceId: { type: String, default: null },
  closedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);