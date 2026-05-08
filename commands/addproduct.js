const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

const Product = require('../database/models/Product');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addproduct')
    .setDescription('Tambah produk baru')
    .addStringOption(option =>
      option
        .setName('code')
        .setDescription('Kode produk')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('Nama produk')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('price')
        .setDescription('Harga produk')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('description')
        .setDescription('Deskripsi produk')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const code = interaction.options.getString('code');
    const name = interaction.options.getString('name');
    const price = interaction.options.getInteger('price');
    const description =
      interaction.options.getString('description') || '-';

    const exists = await Product.findOne({
      guildId: interaction.guild.id,
      code
    });

    if (exists) {
      return interaction.reply({
        content: 'Produk dengan code tersebut sudah ada.',
        ephemeral: true
      });
    }

    await Product.create({
      guildId: interaction.guild.id,
      code,
      name,
      price,
      description
    });

    const embed = new EmbedBuilder()
      .setTitle('✅ Produk Ditambahkan')
      .addFields(
        {
          name: 'Code',
          value: code,
          inline: true
        },
        {
          name: 'Nama',
          value: name,
          inline: true
        },
        {
          name: 'Harga',
          value: `Rp ${price.toLocaleString('id-ID')}`,
          inline: true
        },
        {
          name: 'Deskripsi',
          value: description
        }
      );

    interaction.reply({
      embeds: [embed]
    });
  }
};