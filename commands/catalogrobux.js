const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('catalogrobux')
    .setDescription('Kirim panel promo')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('DISC SHOP - ROBUX!')
      .setDescription(`
**Layanan Discord Nitro & Joki Quest**

**PRICE LIST ROBUX**

Nitro M - Via Log  
Rp 25.000
`)
      .setColor('#5865F2')
      .setFooter({ text: 'DISC SHOP • Instant Delivery' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('pilih_robux')
      .setPlaceholder('Pilih layanan Discord & Gaming')
      .addOptions([
        {
          label: '1000 ROBUX - VIA LOG',
          description: 'Rp 110.000',
          value: 'robux_1'
        },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  },
};