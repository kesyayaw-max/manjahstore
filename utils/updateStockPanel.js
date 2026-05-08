const { EmbedBuilder } = require('discord.js');
const Product = require('../database/models/Product');
const Stock = require('../database/models/Stock');
const { STOCK_CHANNEL_ID } = require('../config');

module.exports = async function updateStockPanel(client, guildId) {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return;

  const channel = guild.channels.cache.get(STOCK_CHANNEL_ID);
  if (!channel) return;

  const products = await Product.find({
    guildId,
    active: true
  });

  let description = `**Ringkasan:** ${products.length} Produk\n\n`;

  for (const product of products) {
    const stock = await Stock.countDocuments({
      guildId,
      productCode: product.code,
      sold: false
    });

    description += `**${product.name}**\n`;
    description += `Rp ${product.price.toLocaleString('id-ID')} | Stok: ${stock > 0 ? `✅ ${stock} tersisa` : '❌ HABIS'}\n\n`;
  }

  const embed = new EmbedBuilder()
    .setTitle('📋 PANEL STOK DETAIL')
    .setDescription(description || 'Belum ada produk.')
    .setColor('Green')
    .setTimestamp();

  const messages = await channel.messages.fetch({ limit: 10 });
  const oldPanel = messages.find(msg =>
    msg.author.id === client.user.id &&
    msg.embeds[0]?.title === '📋 PANEL STOK DETAIL'
  );

  if (oldPanel) {
    await oldPanel.edit({ embeds: [embed] });
  } else {
    await channel.send({ embeds: [embed] });
  }
};