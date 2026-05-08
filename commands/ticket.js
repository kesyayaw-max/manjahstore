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
    .setName('ticketpanel')
    .setDescription('Panel ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('🎟️ Support Ticket System')
      .setDescription(
`Klik tombol di bawah untuk membuat tiket baru

📝 **Cara Menggunakan**
1. Klik tombol "Buat Tiket"
2. Jelaskan kebutuhan Anda
3. Tunggu admin merespons
4. Wajib Kirim Testimoni
5. Wajib kirim transaksi ke admin

⚖️ **Aturan**
• Jangan spam
• Jelaskan dengan jelas
• Sabar menunggu admin`
      )
      .setColor('#5865F2')
      .setFooter({ text: 'Disc Shop | Manjah Bot' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel('Buat Tiket')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  },
};