const { EmbedBuilder } = require('discord.js');
const faqData = require('../data/faq.json');
const smartReply = require('../ai/smartReply');

const cooldown = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message) {

    // ===== FILTER =====
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.channel.name.startsWith('ticket-')) return;

    // ✅ WAJIB: definisi text
    const text = message.content.toLowerCase();

    // ===== COOLDOWN 15 DETIK =====
    const last = cooldown.get(message.author.id);
    if (last && Date.now() - last < 15_000) return;

    let replyText = null;

    // 1️⃣ FAQ MANUAL (faq.json)
    const manual = faqData.find(f =>
      f.keywords.some(k => text.includes(k))
    );

    if (manual) {
      replyText = manual.reply;
    } else {
      // 2️⃣ SMART AI
      const intent = smartReply(text);
      if (intent) replyText = intent.reply;
    }

    if (!replyText) return;

    cooldown.set(message.author.id, Date.now());

    const embed = new EmbedBuilder()
      .setTitle('🤖 AUTO RESPON')
      .setDescription(replyText)
      .setColor('Blurple');

    await message.reply({ embeds: [embed] });
  }
};
