const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require('discord.js');

const Stock = require('../database/models/Stock');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autopanel')
    .setDescription('Kirim auto order panel')
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    // =========================
    // STOCK TOTAL
    // =========================

    const available = await Stock.countDocuments({
      guildId: interaction.guild.id,
      sold: false
    });

    const sold = await Stock.countDocuments({
      guildId: interaction.guild.id,
      sold: true
    });

    // =========================
    // EMBED
    // =========================

    const embed = new EmbedBuilder()
      .setTitle('MANJAH STORE')
      .setDescription(
`## AUTO ORDER MANJAH STORE

• Total Stok Tersedia
➥ **${available} Stock**

• Transaksi Sukses
➥ **${sold} Success**

• Terakhir Update
➥ **0 detik yang lalu**

## ORDER HERE`
      )
      .setColor('#2F3136');

    // =========================
    // SELECT MENU
    // =========================

    const menu = new StringSelectMenuBuilder()
      .setCustomId('auto_category')
      .setPlaceholder('Pilih Kategori Produk Disini...')
      .addOptions([
        {
          label: 'Akun DC',
          description: 'Produk akun discord',
          emoji: '🎱',
          value: 'akun_dc'
        },
        {
          label: 'App Premium',
          description: 'Netflix, Spotify, dll',
          emoji: '🎊',
          value: 'app_premium'
        },
        {
          label: 'Boost',
          description: 'Boost server discord',
          emoji: '🎗️',
          value: 'boost'
        },
        {
          label: 'Decorations',
          description: 'Decoration profile',
          emoji: '🖼️',
          value: 'deco'
        },
        {
          label: 'Nitro Area',
          description: 'Nitro discord',
          emoji: '💎',
          value: 'nitro'
        }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    // =========================
    // BUTTONS
    // =========================

    const buttons = new ActionRowBuilder().addComponents(

      new ButtonBuilder()
        .setCustomId('panel_stock')
        .setLabel('Panel Stock')
        .setEmoji('📋')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
    .setCustomId('rekap_transaksi')
     .setLabel('Rekap Transaksi')
     .setEmoji('⭐')
       .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setLabel('Testimoni')
        .setEmoji('📨')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.com')
    );

    // =========================
    // SEND
    // =========================

    await interaction.channel.send({
      embeds: [embed],
      components: [row, buttons]
    });

    await interaction.reply({
      content: '✅ Auto panel berhasil dikirim.',
      ephemeral: true
    });
  }
};