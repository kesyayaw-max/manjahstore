const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('catalognetflix')
    .setDescription('Katalog layanan netflix premium')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle(' DISC SHOP - NETFLIX PREMIUM')
      .setDescription(`
**PRICE LIST SERVER BOOST**

🚀 Netflix Premium 1 Days  
Rp 10.000

🚀 Netflix Premium 1 Bulan
Rp 35.000

`)
      .setColor('#F47FFF')
      .setFooter({ text: 'DISC SHOP • Instant Delivery' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('pilih_netflix')
      .setPlaceholder('Pilih paket server boost')
      .addOptions([
        {
          label: 'Netflix Premium 1 Days',
          description: 'Rp 10.000',
          value: 'netflix_1'
        },
        {
          label: 'Netflix Premium 1 Bulan',
          description: 'Rp 35.000',
          value: 'netflix_2'
        },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
 