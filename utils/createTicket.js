const {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const Invoice = require('../database/models/Invoice');

const CATEGORY_ID = "1411525533937696852";
const SUPPORT_ROLE_ID = "1411525531383365742";
const LOG_CHANNEL_ID = "1411525532390264880";

module.exports = async function createTicket({
  interaction,
  client,
  layanan = "General Support"
}) {

  const guild = interaction.guild;
  const user = interaction.user;

  // ❌ Cek ticket existing
  const existing = guild.channels.cache.find(c => c.topic === user.id);

  if (existing) {
    return interaction.reply({
      content: `❌ Kamu sudah punya ticket: ${existing}`,
      ephemeral: true
    });
  }

  // =========================
  // AUTO DETECT PRODUCT CODE
  // =========================

  let productCode = 'general';
  let totalPrice = 0;

  const lower = layanan.toLowerCase();

  if (lower.includes('nitro')) {
    productCode = 'nitro1m';
    totalPrice = 25000;
  }

  if (lower.includes('spotify')) {
    productCode = 'spotify_1';
    totalPrice = 25000;
  }

  if (lower.includes('chat gpt')) {
    productCode = 'gpt_1';
    totalPrice = 20000;
  }

  if (lower.includes('boost')) {
    productCode = 'boost_4';
    totalPrice = 45000;
  }

  if (lower.includes('netflix')) {
    productCode = 'netflix_1';
    totalPrice = 35000;
  }

  // =========================
  // CREATE INVOICE
  // =========================

  const invoiceId = `INV-${Date.now()}`;

  await Invoice.create({
    guildId: guild.id,
    invoiceId,
    userId: user.id,
    productCode,
    quantity: 1,
    totalPrice,
    status: 'pending'
  });

  // =========================
  // CREATE TICKET CHANNEL
  // =========================

  const channel = await guild.channels.create({
    name: `ticket-${user.username}`,
    type: ChannelType.GuildText,
    parent: CATEGORY_ID,
    topic: user.id,
    permissionOverwrites: [
      {
        id: guild.roles.everyone,
        deny: [PermissionsBitField.Flags.ViewChannel]
      },
      {
        id: user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages
        ]
      },
      {
        id: SUPPORT_ROLE_ID,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages
        ]
      }
    ]
  });

  // =========================
  // EMBED
  // =========================

  const embed = new EmbedBuilder()
    .setTitle("🎫 TICKET DIBUKA")
    .setDescription(
`👤 User: <@${user.id}>
📦 Layanan: **${layanan}**

🧾 Invoice ID: \`${invoiceId}\`
💰 Harga: Rp ${totalPrice.toLocaleString('id-ID')}

Silakan kirim bukti pembayaran kamu.`
    )
    .setColor("Green");

  // =========================
  // BUTTONS
  // =========================

  const row = new ActionRowBuilder().addComponents(

    new ButtonBuilder()
      .setCustomId("payment_done")
      .setLabel("Sudah Bayar")
      .setStyle(ButtonStyle.Success)
      .setEmoji("💰"),

    new ButtonBuilder()
      .setCustomId("payment_accept")
      .setLabel("Accept Payment")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("✅"),

    new ButtonBuilder()
      .setCustomId("ticket_claim")
      .setLabel("Claim")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("👤"),

    new ButtonBuilder()
      .setCustomId("ticket_close")
      .setLabel("Close")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("🔒")
  );

  // =========================
  // SEND MESSAGE
  // =========================

  await channel.send({
    content: `<@${user.id}> <@&${SUPPORT_ROLE_ID}>`,
    embeds: [embed],
    components: [row]
  });

  // =========================
  // LOG OPEN
  // =========================

  const log = guild.channels.cache.get(LOG_CHANNEL_ID);

  if (log) {
    log.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("🟢 TICKET OPEN")
          .addFields(
            {
              name: "👤 User",
              value: `<@${user.id}>`,
              inline: true
            },
            {
              name: "🔒 Channel",
              value: `${channel}`,
              inline: true
            },
            {
              name: "📦 Layanan",
              value: layanan
            },
            {
              name: "🧾 Invoice",
              value: invoiceId
            }
          )
          .setColor("Green")
          .setTimestamp()
      ]
    });
  }

  // =========================
  // REPLY USER
  // =========================

  await interaction.reply({
    content: `✅ Ticket berhasil dibuat: ${channel}`,
    ephemeral: true
  });
};