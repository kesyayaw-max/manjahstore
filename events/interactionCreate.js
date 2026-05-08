const Stock = require('../database/models/Stock');
const Product = require('../database/models/Product');
const Invoice = require('../database/models/Invoice');
const updateStockPanel = require('../utils/updateStockPanel');
const { AUTO_ORDER_LOG_CHANNEL_ID } = require('../config');

const {
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  MessageFlags,
  PermissionFlagsBits
} = require('discord.js');

const createTicket = require('../utils/createTicket');
const LOG_CHANNEL_ID = "1411525532390264880";

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {

    // ===== USER SUDAH BAYAR =====
    if (interaction.isButton() && interaction.customId === 'payment_done') {

      const ADMIN_ROLE_ID = '1411525531383365742';

      await interaction.channel.send(
        `🔔 <@&${ADMIN_ROLE_ID}> **User sudah melakukan pembayaran!**\n👤 <@${interaction.user.id}>`
      );

      return interaction.reply({
        content: '✅ Pembayaran dikonfirmasi. Menunggu admin.',
        flags: MessageFlags.Ephemeral
      });
    }

    // ===== PAYMENT ACCEPT + AUTO DELIVERY =====
if (interaction.isButton() && interaction.customId === 'payment_accept') {

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: '❌ Hanya admin yang bisa melakukan ini.',
      flags: MessageFlags.Ephemeral
    });
  }

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });

  try {
    const userId = interaction.channel.topic;

    if (!userId) {
      return interaction.editReply({
        content: '❌ User tidak ditemukan di topic channel.'
      });
    }

    const invoice = await Invoice.findOne({
      guildId: interaction.guild.id,
      userId,
      status: 'pending'
    }).sort({ createdAt: -1 });

    if (!invoice) {
      return interaction.editReply({
        content: '❌ Invoice pending tidak ditemukan.'
      });
    }

    const product = await Product.findOne({
      guildId: interaction.guild.id,
      code: invoice.productCode
    });

    if (!product) {
      return interaction.editReply({
        content: `❌ Produk tidak ditemukan. Code: \`${invoice.productCode}\``
      });
    }

    const stock = await Stock.findOneAndUpdate(
      {
        guildId: interaction.guild.id,
        productCode: invoice.productCode,
        sold: false
      },
      {
        sold: true,
        soldTo: userId,
        soldAt: new Date()
      },
      { returnDocument: 'after' }
    );

    if (!stock) {
      return interaction.editReply({
        content: '❌ Stock produk habis.'
      });
    }

    invoice.status = 'paid';
    await invoice.save();

    await updateStockPanel(interaction.client, interaction.guild.id);

    const logChannel = interaction.guild.channels.cache.get(AUTO_ORDER_LOG_CHANNEL_ID);

    if (logChannel) {
      await logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('🛒 NEW PAYMENT RECEIVED')
            .addFields(
              { name: '👤 Buyer', value: `<@${userId}>`, inline: true },
              { name: '📦 Produk', value: product.name, inline: true },
              { name: '💵 Total', value: `Rp ${invoice.totalPrice.toLocaleString('id-ID')}`, inline: true },
              { name: '🧾 Invoice', value: invoice.invoiceId }
            )
            .setColor('Green')
            .setTimestamp()
        ]
      });
    }

    const user = await interaction.client.users.fetch(userId);

    const dmSent = await user.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('✅ Produk Berhasil Dikirim')
          .setDescription(
`Terima kasih telah membeli **${product.name}**

📦 Produk kamu:

\`\`\`
${stock.content}
\`\`\`
`
          )
          .setColor('Green')
      ]
    }).then(() => true).catch(() => false);

    await interaction.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('✅ PAYMENT ACCEPTED')
          .setDescription(
            dmSent
              ? `Pembayaran diterima. Produk berhasil dikirim ke DM <@${userId}>.\n\nTicket akan ditutup otomatis dalam **5 menit**.`
              : `Pembayaran diterima, tapi DM user tertutup. Produk tetap sudah ditandai sold.\n\nTicket akan ditutup otomatis dalam **5 menit**.`
          )
          .setColor('Green')
          .setFooter({ text: `Admin: ${interaction.user.tag}` })
      ]
    });

    await interaction.editReply({
      content: '✅ Payment accepted dan produk berhasil diproses.'
    });

    setTimeout(async () => {
      try {
        await interaction.channel.send('🔒 Ticket ditutup otomatis.');
        await interaction.channel.delete();
      } catch (e) {}
    }, 5 * 60 * 1000);

    return;

  } catch (error) {
    console.error('[PAYMENT_ACCEPT ERROR]', error);

    return interaction.editReply({
      content: '❌ Terjadi error saat memproses payment.'
    });
  }
}

    // ===== SLASH COMMAND =====
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) await command.execute(interaction);
      return;
    }

    // ===== PANEL OPEN =====
    if (interaction.isButton() && interaction.customId === "open_ticket") {
      return createTicket({ interaction, client });
    }

    // ===== KATALOG NITRO =====
    if (interaction.isStringSelectMenu() && interaction.customId === "pilih_layanan") {

      const map = {
        nitro_link: "Nitro 3M Via Link - Rp30.000",
        nitro_log: "Nitro 3M Via Log - Rp41.000",
        joki: "Joki Quest Discord - Rp10.000"
      };

      return createTicket({
        interaction,
        client,
        layanan: map[interaction.values[0]] || "Unknown Service"
      });
    }

    // ===== KATALOG BOOST =====
    if (interaction.isStringSelectMenu() && interaction.customId === "pilih_boost") {

      const map = {
        boost_4: "4x Server Boost 1 Bulan - Rp45.000",
        boost_8: "8x Server Boost 1 Bulan - Rp82.000",
        boost_12: "12x Server Boost 1 Bulan - Rp123.000",
        boost_14: "14x Server Boost 1 Bulan - Rp144.000"
      };

      return createTicket({
        interaction,
        client,
        layanan: map[interaction.values[0]] || "Server Boost"
      });
    }

    // ===== CATALOG NETFLIX =====
    if (interaction.isStringSelectMenu() && interaction.customId === "pilih_netflix") {

      const map = {
        boost_4: "Netflix Premium 1 Days - Rp10.000",
        boost_8: "Netflix Premium 1 Bulan - Rp35.000"
      };

      return createTicket({
        interaction,
        client,
        layanan: map[interaction.values[0]] || "Netflix Premium"
      });
    }

    // ===== CATALOG SPOTIFY =====
    if (interaction.isStringSelectMenu() && interaction.customId === "pilih_spotify") {

      const map = {
        spotify_1: "Spotify Premium 1 M - Rp25.000",
      };

      return createTicket({
        interaction,
        client,
        layanan: map[interaction.values[0]] || "Spotify Premium"
      });
    }

    // ===== CATALOG GPT =====
    if (interaction.isStringSelectMenu() && interaction.customId === "pilih_chatgpt") {

      const map = {
        gpt_1: "Chat Gpt Premium 1 M - Rp20.000",
      };

      return createTicket({
        interaction,
        client,
        layanan: map[interaction.values[0]] || "Chat Gpt Premium"
      });
    }

    // ===== CATALOG BOT DISCORD =====
    if (interaction.isStringSelectMenu() && interaction.customId === "pilih_bot") {

      const map = {
        robux_1: "1000 ROBUX VIA LOG - Rp110.000",
      };

      return createTicket({
        interaction,
        client,
        layanan: map[interaction.values[0]] || "Netflix Premium"
      });
    }

    // ===== CATALOG ROBUX =====
    if (interaction.isStringSelectMenu() && interaction.customId === "pilih_robux") {

      const map = {
        rockstar: "Rockstar Account - Rp 35.000",
      };

      return createTicket({
        interaction,
        client,
        layanan: map[interaction.values[0]] || "Netflix Premium"
      });
    }

    // ===== CATALOG ACENG =====
    if (interaction.isStringSelectMenu() && interaction.customId === "pilih_aceng") {

      const map = {
        aceng: "Aceng - Rp 25.000.000",
      };

      return createTicket({
        interaction,
        client,
        layanan: map[interaction.values[0]] || "Aceng"
      });
    }

    // ===== CATALOG ROCKSTAR =====
    if (interaction.isStringSelectMenu() && interaction.customId === "pilih_robux") {

      const map = {
        bot_1: "Bot Discord - JUST DM FOR THE PRICE!",
        server: "Discord Server - Rp 50.000 - Rp 150.000",
      };

      return createTicket({
        interaction,
        client,
        layanan: map[interaction.values[0]] || "Netflix Premium"
      });
    }

// ===== AUTO PANEL CATEGORY =====
if (interaction.isStringSelectMenu() && interaction.customId === 'auto_category') {

  const selected = interaction.values[0];

  const categoryMap = {
    akun_dc: 'Akun DC',
    app_premium: 'App Premium',
    boost: 'Boost',
    deco: 'Decorations',
    nitro: 'Nitro Area'
  };

  return interaction.reply({
    content: `📦 Kamu memilih kategori: **${categoryMap[selected]}**`,
    ephemeral: true
  });
}

// ===== PANEL STOCK BUTTON =====
if (interaction.isButton() && interaction.customId === 'panel_stock') {

  return interaction.reply({
    content: '📋 Panel stock akan segera dibuat.',
    ephemeral: true
  });
}

// ===== REKAP TRANSAKSI =====
if (interaction.isButton() && interaction.customId === 'rekap_transaksi') {

  return interaction.reply({
    content: '⭐ Rekap transaksi akan segera dibuat.',
    ephemeral: true
  });
}


    // ===== CLOSE BUTTON =====
    if (interaction.isButton() && interaction.customId === "ticket_close") {

      const modal = new ModalBuilder()
        .setCustomId("ticket_close_modal")
        .setTitle("Tutup Ticket");

      const reason = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Alasan penutupan")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(reason));
      return interaction.showModal(modal);
    }

    // ===== CLOSE MODAL =====
    if (interaction.isModalSubmit() && interaction.customId === "ticket_close_modal") {

      const reason = interaction.fields.getTextInputValue("reason");
      const channel = interaction.channel;

      const log = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
      if (log) {
        log.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("🔴 TICKET CLOSED")
              .addFields(
                { name: "👤  User", value: `<@${channel.topic}>`, inline: true },
                { name: "🔒Closed By", value: `<@${interaction.user.id}>`, inline: true },
                { name: "📝 Reason", value: reason }
              )
              .setColor("Red")
              .setTimestamp()
          ]
        });
      }

      await interaction.reply("🔒 Ticket akan ditutup...");
      setTimeout(() => channel.delete().catch(() => {}), 3000);
    }

    // ===== CLAIM =====
    if (interaction.isButton() && interaction.customId === "ticket_claim") {
      return interaction.reply({
        content: `👤 Ticket di-claim oleh <@${interaction.user.id}>`
      });
    }
  }
};