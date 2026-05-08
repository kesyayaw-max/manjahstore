const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

const updateStockPanel = require('../utils/updateStockPanel');
const Product = require('../database/models/Product');
const Stock = require('../database/models/Stock');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addstock')
    .setDescription('Tambah stock produk')
    .addStringOption(option =>
      option
        .setName('code')
        .setDescription('Kode produk')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('stock')
        .setDescription('Isi stock / akun / kode produk')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const code = interaction.options.getString('code');
    const stockContent = interaction.options.getString('stock');

    const product = await Product.findOne({
      guildId: interaction.guild.id,
      code
    });

    if (!product) {
      return interaction.reply({
        content: '❌ Produk tidak ditemukan. Tambahkan dulu dengan `/addproduct`.',
        ephemeral: true
      });
    }

    await Stock.create({
      guildId: interaction.guild.id,
      productCode: code,
      content: stockContent
    });

    await updateStockPanel(interaction.client, interaction.guild.id);

    const totalStock = await Stock.countDocuments({
      guildId: interaction.guild.id,
      productCode: code,
      sold: false
    });

    const embed = new EmbedBuilder()
      .setTitle('✅ Stock Ditambahkan')
      .addFields(
        {
          name: 'Produk',
          value: product.name,
          inline: true
        },
        {
          name: 'Code',
          value: code,
          inline: true
        },
        {
          name: 'Total Stock Tersedia',
          value: `${totalStock}`,
          inline: true
        }
      );

    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};