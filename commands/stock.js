const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

const Product = require('../database/models/Product');
const Stock = require('../database/models/Stock');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stock')
    .setDescription('Cek stock produk')
    .addStringOption(option =>
      option
        .setName('code')
        .setDescription('Kode produk')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const code = interaction.options.getString('code');

    const product = await Product.findOne({
      guildId: interaction.guild.id,
      code
    });

    if (!product) {
      return interaction.reply({
        content: '❌ Produk tidak ditemukan.',
        ephemeral: true
      });
    }

    const available = await Stock.countDocuments({
      guildId: interaction.guild.id,
      productCode: code,
      sold: false
    });

    const sold = await Stock.countDocuments({
      guildId: interaction.guild.id,
      productCode: code,
      sold: true
    });

    const embed = new EmbedBuilder()
      .setTitle('📦 Stock Produk')
      .addFields(
        { name: 'Produk', value: product.name, inline: true },
        { name: 'Code', value: product.code, inline: true },
        { name: 'Harga', value: `Rp ${product.price.toLocaleString('id-ID')}`, inline: true },
        { name: 'Stock Tersedia', value: `${available}`, inline: true },
        { name: 'Terjual', value: `${sold}`, inline: true }
      );

    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};