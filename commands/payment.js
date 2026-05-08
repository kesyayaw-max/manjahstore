const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

// ⏳ simpan status pembayaran
const paymentStatus = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('payment')
    .setDescription('Informasi pembayaran QRIS (Admin Only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Admin only.', ephemeral: true });
    }

    const qris = new AttachmentBuilder('./assets/qris.jpeg');
    const channelId = interaction.channel.id;

    paymentStatus.set(channelId, false);

    const embed = new EmbedBuilder()
      .setTitle('💳 INFORMASI PEMBAYARAN')
      .setDescription(`
Silakan lakukan pembayaran via **QRIS**.

⏳ **Batas waktu pembayaran: 30 menit**
Jika tidak ada konfirmasi, ticket akan ditutup otomatis.
Dan kalau mau payment selain Qris bisa kok

`)
      .setImage('attachment://qris.png')
      .setColor('#00B894');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('payment_done')
        .setLabel('Saya Sudah Bayar')
        .setStyle(ButtonStyle.Success)
        .setEmoji('✅')
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      files: [qris]
    });

    // ⏰ TIMER 30 MENIT
    setTimeout(async () => {
      if (paymentStatus.get(channelId)) return;

      try {
        await interaction.channel.send(
          '⏰ **Waktu pembayaran habis. Ticket ditutup otomatis.**'
        );

        await interaction.channel.delete();

      } catch (e) {}
    }, 30 * 60 * 1000);
  }
};

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('payment_done')
    .setLabel('Saya Sudah Bayar')
    .setStyle(ButtonStyle.Success)
    .setEmoji('✅'),

  new ButtonBuilder()
    .setCustomId('payment_accept')
    .setLabel('Payment Accepted (Admin)')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('🛂')
);


// export supaya bisa diakses interactionCreate
module.exports.paymentStatus = paymentStatus;
