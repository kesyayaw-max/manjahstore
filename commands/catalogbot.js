const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('catalogbot')
    .setDescription('Katalog layanan bot discord')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle(' DISC SHOP - BOT DISCORD & SERVER DISCORD!')
      .setDescription(`
**PRICE LIST BOT DSICORD & SERVER DISCORD**

🔒 DISCORD BOT
JUST DM THE PRICE (CAN CUSTOM)

🛡️ Server Discord
Rp 50.000 - Rp 150.000


`)
      .setColor('#F47FFF')
      .setFooter({ text: 'DISC SHOP • Instant Delivery' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('pilih_bot')
      .setPlaceholder('Pilih paket server boost')
      .addOptions([
        {
          label: 'BOT DISCORD',
          description: 'JUST DM',
          value: 'bot_1'
        },
        {
          label: 'SERVER DISCORD',
          description : 'Rp 50.000 - Rp 150.000',
          value : 'server'
        },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
