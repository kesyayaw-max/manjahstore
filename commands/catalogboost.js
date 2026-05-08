const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('catalogboost')
    .setDescription('Katalog layanan server boost')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('🚀 DISC SHOP - SERVER BOOST')
      .setDescription(`
**PRICE LIST SERVER BOOST**

🚀 4x Boost 1 Bulan  
Rp 40.000

🚀 8x Boost 1 Bulan  
Rp 80.000

🚀 12x Boost 1 Bulan  
Rp 120.000

🚀 14x Boost 1 Bulan  
Rp 140.000
`)
      .setColor('#F47FFF')
      .setFooter({ text: 'DISC SHOP • Instant Delivery' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('pilih_boost')
      .setPlaceholder('Pilih paket server boost')
      .addOptions([
        {
          label: '4x Boost 1 Bulan',
          description: 'Rp 40.000',
          value: 'boost_4'
        },
        {
          label: '8x Boost 1 Bulan',
          description: 'Rp 80.000',
          value: 'boost_8'
        },
        {
          label: '12x Boost 1 Bulan',
          description: 'Rp 120.000',
          value: 'boost_12'
        },
        {
          label: '14x Boost 1 Bulan',
          description: 'Rp 140.000',
          value: 'boost_14'
        }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
