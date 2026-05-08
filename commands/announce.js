const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('📢 Buat pengumuman')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    .addChannelOption(o =>
      o.setName('channel')
        .setDescription('Channel tujuan')
        .setRequired(true)
    )

    .addStringOption(o =>
      o.setName('judul')
        .setDescription('Judul pengumuman')
        .setRequired(true)
    )

    .addStringOption(o =>
      o.setName('isi')
        .setDescription('Isi pengumuman')
        .setRequired(true)
    )

    .addBooleanOption(o =>
      o.setName('ping')
        .setDescription('Ping @everyone')
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const judul = interaction.options.getString('judul');
    const isi = interaction.options.getString('isi');
    const ping = interaction.options.getBoolean('ping');

    const embed = new EmbedBuilder()
      .setTitle(judul)
      .setDescription(isi)
      .setColor('Orange')
      .setFooter({ text: interaction.guild.name })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel('🎟 Open Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await channel.send({
      content: ping ? '@everyone' : null,
      embeds: [embed],
      components: [row]
    });

    await interaction.reply({
      content: '✅ Pengumuman berhasil dikirim',
      flags: 64
    });
  }
};
