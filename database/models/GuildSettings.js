const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  logChannelId: { type: String, default: null },
  ticketCategoryId: { type: String, default: null },
  adminRoleId: { type: String, default: null },
  language: { type: String, default: 'id' }
}, { timestamps: true });

module.exports = mongoose.model('GuildSettings', guildSettingsSchema);