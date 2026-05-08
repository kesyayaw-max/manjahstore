const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('catalognitro')
    .setDescription('Kirim panel promo')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('DISC SHOP - DISCORD & GAMING SERVICES')
      .setDescription(`
**Layanan Discord Nitro & Joki Quest**

**PRICE LIST DISCORD**

Nitro 3M - Via Link  
Rp 30.000

Nitro 3M - Via Log  
Rp 41.000

Joki Quest Discord  
Rp 10.000
`)
      .setColor('#5865F2')
      .setFooter({ text: 'DISC SHOP • Instant Delivery' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('pilih_layanan')
      .setPlaceholder('Pilih layanan Discord & Quest')
      .addOptions([
        {
          label: 'Nitro 3M - Via Link',
          description: 'Rp 30.000',
          value: 'nitro_link'
        },
        {
          label: 'Nitro 3M - Via Log',
          description: 'Rp 41.000',
          value: 'nitro_log'
        },
        {
          label: 'Joki Quest Discord',
          description: 'Rp 10.000',
          value: 'joki'
        }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  },
};