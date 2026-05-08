const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('catalogaceng')
    .setDescription('Kirim panel promo')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('DISC SHOP - ACENG!')
      .setDescription(`
**Layanan Discord Nitro & Joki Quest**

**PRICE LIST Orang Ganteng**

ACENG  
Rp 25.000.000
`)
      .setColor('#5865F2')
      .setFooter({ text: 'DISC SHOP • Instant Delivery' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('pilih_aceng')
      .setPlaceholder('Pilih layanan Discord & Gaming')
      .addOptions([
        {
          label: 'aceng',
          description: 'Rp 25.000.000',
          value: 'aceng'
        },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  },
};